import pymysql
import boto3
import json
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

    path_parameters = event.get("pathParameters")
    product_id = path_parameters.get("id") if path_parameters else None

    try: 
        connection = pymysql.connect(host=endpoint, user=username, password=password, db=database_name)
    except Exception as e: 
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Database connection failed: {str(e)}"})
        }
    
    try: 
        connection.ping(reconnect=False)
        cursor = connection.cursor()

        query = f"SELECT * FROM products WHERE ID={product_id}" 
        cursor.execute(query)
        item = cursor.fetchone()

        cursor.close()
        connection.close()
        return {
            'statusCode': 200,
            "headers": {
              "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
              "Access-Control-Allow-Methods": "DELETE,GET,OPTIONS",
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json"
            },
            'body': json.dumps(item, default=custom_serializer)
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Failed to fetch data: {str(e)}"})
        }
