def generate_specific_account(username, email, password, firstname, lastname, address, city, gender, phone, pp_path):
    account = {
        'username': username,
        'email': email,
        'password': password,
        'firstname': firstname,
        'lastname': lastname,
        'address': address,
        'city': city,
        'gender': gender,
        'phone': phone,
        'profile_picture': pp_path
    }
    return account

accounts = [
    generate_specific_account(
        username='admin',
        email='admin@admin.com',
        password='admin',
        firstname='Admin',
        lastname='Admin',
        address='Admin Address',
        city='Admin City',
        gender='Homme',
        phone='0000000000',
        pp_path='images/admin.png'
    ),
    generate_specific_account(
        username='NormalUser',
        email='normal.user@gmail.com',
        password='1234',
        firstname='Normal',
        lastname='User',
        address='Some Street',
        city='Some City',
        gender='Homme',
        phone='0601234567',
        pp_path='images/user.png'
    )
]
