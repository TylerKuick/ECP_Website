import pymysql
import json
import boto3
from datetime import datetime

def custom_serializer(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    

def lambda_handler(event, context):
    rds = boto3.client('rds')
    rds_obj = rds.describe_db_instances(DBInstanceIdentifier="ecp-rds")
    
    endpoint = rds_obj['DBInstances'][0]["Endpoint"]["Address"] # get using boto3
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
    finally:
        if connection: 
            connection.close()
            print("Connection closed")
        
    