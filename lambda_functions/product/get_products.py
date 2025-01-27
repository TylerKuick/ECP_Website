import pymysql
import json
import boto3
import os
from datetime import datetime

def custom_serializer(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    

def lambda_handler(event, context):
    
    endpoint = os.environ['DB_HOST']
    username = "admin"
    password = "password" 
    database_name = "ecp_dev" 
    
    try: 
        connection = pymysql.connect(host=endpoint, user=username, password=password, db=database_name)
    except Exception as e: 
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Database connection failed: {str(e)}"})
        }
    
    try: 
        connection.ping(reconnect=True)
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        
        query = "SELECT * FROM products" 
        cursor.execute(query)
        rows = cursor.fetchall()
        
        connection.close()
        return {
            'statusCode': 200,
            'body': json.dumps(rows, default=custom_serializer)
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Failed to fetch data: {str(e)}"})
        }
        

    