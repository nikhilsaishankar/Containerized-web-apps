// State-wise sports tournaments data
const tournaments = {
    "Maharashtra": {
        "Cricket": [
            {
                id: 1,
                name: "Mumbai Premier League",
                venue: "Wankhede Stadium, Mumbai",
                date: "2024-12-15",
                prize: "₹5,00,000",
                teamSize: 11,
                contact: "cricket.mumbai@msca.com",
                registrationFee: "₹5000"
            },
            {
                id: 2,
                name: "Pune City Championship",
                venue: "MCA Stadium, Pune",
                date: "2024-12-20",
                prize: "₹3,00,000",
                teamSize: 11,
                contact: "cricket.pune@msca.com",
                registrationFee: "₹4000"
            }
        ],
        "Football": [
            {
                id: 3,
                name: "Mumbai Football League",
                venue: "Cooperage Ground, Mumbai",
                date: "2024-12-10",
                prize: "₹4,00,000",
                teamSize: 11,
                contact: "football.mumbai@wifa.com",
                registrationFee: "₹6000"
            }
        ],
        "Badminton": [
            {
                id: 4,
                name: "Maharashtra State Badminton",
                venue: "Andheri Sports Complex, Mumbai",
                date: "2024-12-25",
                prize: "₹2,00,000",
                teamSize: 1,
                contact: "badminton.mh@badmintonindia.com",
                registrationFee: "₹1500"
            }
        ]
    },
    "Karnataka": {
        "Cricket": [
            {
                id: 5,
                name: "Bengaluru T20 Cup",
                venue: "M Chinnaswamy Stadium, Bengaluru",
                date: "2024-12-18",
                prize: "₹6,00,000",
                teamSize: 11,
                contact: "cricket.blr@ksca.com",
                registrationFee: "₹7000"
            }
        ],
        "Football": [
            {
                id: 6,
                name: "Bengaluru City League",
                venue: "Kanteerava Stadium, Bengaluru",
                date: "2024-12-22",
                prize: "₹4,50,000",
                teamSize: 11,
                contact: "football.blr@kfa.com",
                registrationFee: "₹5500"
            }
        ],
        "Kabaddi": [
            {
                id: 7,
                name: "Karnataka Kabaddi Cup",
                venue: "Kanteerava Indoor Stadium, Bengaluru",
                date: "2024-12-28",
                prize: "₹3,50,000",
                teamSize: 7,
                contact: "kabaddi.ka@karnatakakabaddi.com",
                registrationFee: "₹4500"
            }
        ]
    },
    "Delhi NCR": {
        "Cricket": [
            {
                id: 8,
                name: "Delhi Premier League",
                venue: "Feroz Shah Kotla, Delhi",
                date: "2024-12-12",
                prize: "₹5,50,000",
                teamSize: 11,
                contact: "cricket.delhi@ddca.com",
                registrationFee: "₹6000"
            }
        ],
        "Basketball": [
            {
                id: 9,
                name: "NCR Basketball Championship",
                venue: "Thyagraj Stadium, Delhi",
                date: "2024-12-19",
                prize: "₹2,50,000",
                teamSize: 5,
                contact: "basketball.ncr@basketballindia.com",
                registrationFee: "₹3000"
            }
        ],
        "Tennis": [
            {
                id: 10,
                name: "Delhi Open Tennis",
                venue: "RK Khanna Stadium, Delhi",
                date: "2024-12-30",
                prize: "₹3,00,000",
                teamSize: 1,
                contact: "tennis.delhi@delhitennis.com",
                registrationFee: "₹2000"
            }
        ]
    },
    "Tamil Nadu": {
        "Cricket": [
            {
                id: 11,
                name: "Chennai Super League",
                venue: "MA Chidambaram Stadium, Chennai",
                date: "2024-12-14",
                prize: "₹4,50,000",
                teamSize: 11,
                contact: "cricket.chennai@tnca.com",
                registrationFee: "₹5500"
            }
        ],
        "Football": [
            {
                id: 12,
                name: "Chennai Football Trophy",
                venue: "Jawaharlal Nehru Stadium, Chennai",
                date: "2024-12-21",
                prize: "₹3,50,000",
                teamSize: 11,
                contact: "football.chennai@tnfa.com",
                registrationFee: "₹5000"
            }
        ]
    },
    "West Bengal": {
        "Football": [
            {
                id: 13,
                name: "Kolkata Premier League",
                venue: "Salt Lake Stadium, Kolkata",
                date: "2024-12-16",
                prize: "₹7,00,000",
                teamSize: 11,
                contact: "football.kolkata@ifa.com",
                registrationFee: "₹8000"
            }
        ],
        "Kabaddi": [
            {
                id: 14,
                name: "Bengal Kabaddi League",
                venue: "Netaji Indoor Stadium, Kolkata",
                date: "2024-12-27",
                prize: "₹3,00,000",
                teamSize: 7,
                contact: "kabaddi.wb@wbkabaddi.com",
                registrationFee: "₹4000"
            }
        ]
    },
    "Punjab": {
        "Hockey": [
            {
                id: 15,
                name: "Punjab Hockey Championship",
                venue: "Surjit Hockey Stadium, Jalandhar",
                date: "2024-12-23",
                prize: "₹4,00,000",
                teamSize: 11,
                contact: "hockey.punjab@punjabhockey.com",
                registrationFee: "₹5000"
            }
        ]
    }
};

module.exports = tournaments;
