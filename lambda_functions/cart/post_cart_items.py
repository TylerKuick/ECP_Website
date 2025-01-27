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

    path_parameters = event.get("pathParameters")
    cart_id = path_parameters.get("id") if path_parameters else None
    body = json.loads(event['body'])
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
        
        query = "INSERT INTO cartitems (ProductId, CartId, quantity, total, createdAt, updatedAt) VALUES(%s, %s, %s, %s,now(),now())" 
        cursor.execute(query, (body['ProductId'], cart_id ,body['quantity'], body['total']))

        connection.commit()
        result = "Post Success"
        
        cursor.close()
        connection.close()
        return {
            'statusCode': 201,
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "GET,OPTIONS,POST",
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            'body': json.dumps(f"{result}")
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Failed to fetch data: {str(e)}"})
        }