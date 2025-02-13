import pymysql
import json
import boto3
import os

def lambda_handler(event, context):
    
    endpoint = os.environ['DB_HOST']
    username = "admin" 
    password = "password" 
    database_name = "ecp_dev" 
    result = ""
    try: 
        connection = pymysql.connect(host=endpoint, user=username, password=password, db=database_name)
    except Exception as e: 
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Database connection failed: {str(e)}"})
        }
    try:     
        connection.ping(reconnect=False)
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        
        query = "INSERT INTO products (prod_name, prod_price, description, imgId, createdAt, updatedAt) VALUES(%s, %s, %s, %s, now(),now())" 
        cursor.execute(query, (event['prod_name'], event['prod_price'],event['description'], event['imgId']))
        connection.commit()
        result = "Post Success"
        cursor.close()
        connection.close()
        return {
            'statusCode': 201,
            'body': json.dumps(f"{result}")
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Failed to fetch data: {str(e)}"})
        }