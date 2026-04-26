from flask import Flask, render_template, request, flash, redirect, url_for
from flask_mail import Mail, Message
from data.jobs_data import jobs_data

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Use your SMTP server
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your_email@gmail.com'  # Update this
app.config['MAIL_PASSWORD'] = 'your_app_password'  # Update this
app.config['MAIL_DEFAULT_SENDER'] = 'your_email@gmail.com'

mail = Mail(app)

@app.route('/')
def index():
    states = list(jobs_data.keys())
    return render_template('index.html', states=states)

@app.route('/jobs/<state>')
def jobs(state):
    if state in jobs_data:
        state_data = jobs_data[state]
        return render_template('jobs.html', state=state, 
                             it_jobs=state_data['IT'], 
                             non_it_jobs=state_data['Non-IT'])
    else:
        flash('State not found!', 'error')
        return redirect(url_for('index'))

@app.route('/apply/<int:job_id>')
def apply(job_id):
    # Find the job by ID
    job = None
    job_state = None
    job_type = None
    
    for state, data in jobs_data.items():
        for job_category in ['IT', 'Non-IT']:
            for j in data[job_category]:
                if j['id'] == job_id:
                    job = j
                    job_state = state
                    job_type = job_category
                    break
            if job:
                break
        if job:
            break
    
    if job:
        return render_template('apply.html', job=job, state=job_state, job_type=job_type)
    else:
        flash('Job not found!', 'error')
        return redirect(url_for('index'))

@app.route('/submit_application', methods=['POST'])
def submit_application():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        phone = request.form['phone']
        experience = request.form['experience']
        cover_letter = request.form['cover_letter']
        job_title = request.form['job_title']
        company_email = request.form['company_email']
        company_name = request.form['company_name']
        
        # Create email content
        subject = f"Job Application for {job_title}"
        
        body = f"""
        Job Application Details:
        
        Position: {job_title}
        Applicant Name: {name}
        Email: {email}
        Phone: {phone}
        Experience: {experience}
        
        Cover Letter:
        {cover_letter}
        
        This application was submitted through the Job Portal System.
        """
        
        try:
            # Send email to the organization
            msg = Message(subject, 
                         recipients=[company_email],
                         sender=app.config['MAIL_DEFAULT_SENDER'])
            msg.body = body
            mail.send(msg)
            
            # Send confirmation email to applicant
            confirmation_body = f"""
            Dear {name},
            
            Thank you for applying for the position of {job_title} at {company_name}.
            
            We have received your application and will review it shortly.
            
            Application Details:
            - Position: {job_title}
            - Experience: {experience}
            
            You will be contacted if you are shortlisted for the next round.
            
            Best regards,
            Job Portal Team
            """
            
            confirmation_msg = Message("Application Confirmation",
                                      recipients=[email],
                                      sender=app.config['MAIL_DEFAULT_SENDER'])
            confirmation_msg.body = confirmation_body
            mail.send(confirmation_msg)
            
            flash(f'Application submitted successfully! We have sent a confirmation to {email}', 'success')
            
        except Exception as e:
            flash(f'Error sending application: {str(e)}', 'error')
        
        return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
