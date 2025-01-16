This is a file where we can add any notes that we need.

For example I have put clearer notes on what I pushed today below

Daniel - 1/16
 - cleaned up repo:
    - added gitignore to stop commits with pycaches and the sqlite3 db, also removed them from the repo
        - sqlite3 db removed so we don't share data, allows easier testing with creating our own data
            - after pulling, make sure to migrate to your local db
            - if you change models, make sure to migrate again after changes
        - migrations stays so that the db structure is consistent
        - pycaches get removed because they are automatically generated individually and create clutter in repo
 - Created a team-notes.md file
    - You can store additional info in this file that you deem necessary
    - Might be an alternative to excessively long commit messages and avoiding large blocks of text in slack
        - We should still communicate our project ideas with each other via slack
    - It is not in the .gitignore file so it will push to the repo (may want to be mindful of what you put in here)

    TO DO:
        - finish sales template, css, js

        - other templates
            - inventory looks good, might make changes later if necessary/time permits
            - need to improve template for admin dashboard
            - need template for switch user

        - css
            - need to make css for admin dashbord
            - make css for other templates as made
        
        - js 
            - finish sales and search js
            - other js as needed