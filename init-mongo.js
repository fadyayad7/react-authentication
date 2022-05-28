db.createUser(
    {
        user: "sysAdmin",
        pwd: "pass1010",
        roles: [
            {
                role: "readWrite",
                db: "mongodb"
            }
        ]
    }
)