import csv
import random

# Schema: customer_id,Full_name,email,Age,Gender,Marital_Status,Family_Size,Dependent count,Occupation,Occupation type,Monthly_Income,KYC status,City,Kids_in_Household,App_Installed,Existing Customer,Credit score,Social_Media_Active

occupations = ['Engineer', 'Civil Servant', 'Architect', 'Banker', 'IT Professional', 'Pharmacist', 'Homemaker', 'Teacher', 'Doctor', 'Advocate']
cities = ['Kolkata', 'Bhopal', 'Jaipur', 'Delhi', 'Bengaluru', 'Ahmedabad', 'Kochi', 'Mumbai', 'Lucknow', 'Indore', 'Chennai', 'Patna', 'Hyderabad', 'Chandigarh', 'Pune']
first_names = ['Suresh', 'Vikram', 'Amit', 'Kavya', 'Rahul', 'Pooja', 'Sneha', 'Priya', 'Rohit', 'Anjali', 'Nikhil', 'Arjun', 'Riya', 'Karan', 'Meera', 'Neha']
last_names = ['Kapoor', 'Das', 'Mehta', 'Sinha', 'Sharma', 'Banerjee', 'Iyer', 'Nair', 'Joshi', 'Kulkarni', 'Malhotra', 'Gupta', 'Patel', 'Reddy', 'Verma']

def generate_biased_data(num_rows=10000):
    rows = []
    # Header
    rows.append([
        "customer_id","Full_name","email","Age","Gender","Marital_Status",
        "Family_Size","Dependent count","Occupation","Occupation type",
        "Monthly_Income","KYC status","City","Kids_in_Household",
        "App_Installed","Existing Customer","Credit score","Social_Media_Active"
    ])
    
    for i in range(1, num_rows + 1):
        cust_id = f"CUST{i:04d}"
        fname = random.choice(first_names)
        lname = random.choice(last_names)
        full_name = f"{fname} {lname}"
        email = f"{fname.lower()}.{lname.lower()}{i}@example.com"
        
        # Bias logic
        occupation = random.choice(occupations)
        city = random.choice(cities)
        
        # Age bias based on occupation
        if occupation in ['Doctor', 'Advocate', 'Banker']:
            age = random.randint(35, 60)
        elif occupation in ['Engineer', 'IT Professional']:
            age = random.randint(22, 40)
        else:
            age = random.randint(18, 60)
            
        gender = random.choice(['Male', 'Female'])
        marital = random.choice(['Single', 'Married'])
        kids = random.randint(0, 3) if age > 25 else 0
        family_size = kids + (2 if marital == 'Married' else 1)
        dependents = random.randint(0, kids + 1)
        
        job_type = 'Full-time' if occupation != 'Homemaker' and random.random() > 0.2 else 'Part-time'
        
        # Income bias
        if occupation in ['Doctor', 'Engineer', 'IT Professional', 'Architect']:
            income = random.randint(100000, 250000)
        else:
            income = random.randint(25000, 100000)
            
        # Add high correlation biases for the ML model to explicitly learn
        # 1. High income -> higher chance of KYC and App Installed
        # 2. Young tech people -> Social media active
        kyc = 'Y' if income > 150000 or random.random() > 0.5 else 'N'
        app_installed = 'Y' if (income > 100000 and age < 45) or random.random() > 0.6 else 'N'
        social = 'Y' if age < 35 or occupation in ['IT Professional', 'Engineer'] else 'N'
        
        existing = 'Y' if kyc == 'Y' and random.random() > 0.3 else 'N'
        
        # Credit score heavily biased by income and age
        # Base 400 + (income / 1000) + age
        base_score = 400 + (income / 1000) + age + random.randint(-50, 50)
        c_score = min(max(int(base_score), 300), 850)
        
        row_data = [
            cust_id, full_name, email, age, gender, marital, family_size, dependents,
            occupation, job_type, income, kyc, city, kids, app_installed, existing, c_score, social
        ]
        
        row = [str(item) for item in row_data]
        rows.append(row)
        
    return rows

if __name__ == "__main__":
    file_path = "c:/Users/ASUS/OneDrive/Desktop/MailPilot/data/uploaded_dataset.csv"
    data = generate_biased_data(10000)
    with open(file_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerows(data)
    print(f"Successfully generated {len(data)-1} biased rows to {file_path}")
