import csv
from datetime import datetime
from sqlalchemy.orm import Session
from database import SessionLocal, Investor, Commitment, init_db

def import_csv_to_db(csv_path):
    # Initialize the database
    init_db()
    
    # Create a database session
    db = SessionLocal()
    
    try:
        # Dictionary to cache investors to avoid duplicates
        investors_cache = {}
        
        # Read the CSV file
        with open(csv_path, 'r', encoding='utf-8') as csvfile:
            csvreader = csv.DictReader(csvfile)
            
            for row in csvreader:
                # Check if investor exists, if not create a new one
                investor_key = (row['Investor Name'], row['Investory Type'], row['Investor Country'])
                if investor_key not in investors_cache:
                    investor = Investor(
                        name=row['Investor Name'],
                        type=row['Investory Type'],
                        country=row['Investor Country']
                    )
                    db.add(investor)
                    investors_cache[investor_key] = investor
                else:
                    investor = investors_cache[investor_key]
                
                # Create commitment
                commitment = Commitment(
                    investor=investor,
                    asset_class=row['Commitment Asset Class'],
                    amount=float(row['Commitment Amount'] or 0),
                    currency=row['Commitment Currency'],
                    date_added=datetime.strptime(row['Investor Date Added'], '%Y-%m-%d'),
                    last_updated=datetime.strptime(row['Investor Last Updated'], '%Y-%m-%d')
                )
                db.add(commitment)
        
        # Commit the transactions
        db.commit()
        print(f"Successfully imported data from {csv_path}")
        print(f"Total investors imported: {len(investors_cache)}")
    
    except Exception as e:
        db.rollback()
        print(f"Error importing data: {e}")
    
    finally:
        db.close()

if __name__ == '__main__':
    import os
    
    # Get the directory of the current script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Path to the CSV file
    csv_path = os.path.join(os.path.dirname(base_dir), 'data.csv')
    
    # Import the data
    import_csv_to_db(csv_path)
