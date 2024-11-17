# Crowdsourcing Site
This JavaScript-based application, built using React and Amazon Web Services (AWS), serves as a platform for crowdsourced funding where users can create and support custom projects through pledges and direct donations.

New users can register or sign in with a username and password, selecting an account type: supporter, designer, or administrator. An account is automatically created if a login attempt is made with an unregistered username.
* Administrators: Comprehensive oversight of all projects, whether launched or pending. They can view project details, delete projects, and access essential information for each.
* Supporters: Explore and contribute to active projects, either by claiming pledges tied to specific rewards or through direct donations without rewards. They can filter projects by genre and manage a starting balance, which can be replenished anytime. A dashboard allows them to review past contributions, including direct donations and claimed pledges. If a project fails to reach its funding goal by the deadline, supporters receive refunds for their contributions.
* Designers: Create and manage projects, which include details such as name, description, deadline, goal amount, and genre. Each project may feature a set of pledges with associated rewards, donation amounts, and optional limits on the number of supporters who can claim them. Designers can modify project details and pledges until the project is launched, and they can delete any unpublished project. Once launched, designers can track which supporters have claimed pledges and review overall project support through a dedicated dashboard.

This project was created for CS 3733 (Software Engineering) at Worcester Polytechnic Institute in Fall 2022.
