import pymysql
import boto3
import json
import os

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

        query = f"DELETE FROM products WHERE id={product_id}" 
        cursor.execute(query)
        connection.commit()

        cursor.close()
        connection.close()
        result = "Deleted Successfully"
        return {
            'statusCode': 200,
            'body': json.dumps(f"{result}")
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Failed to fetch data: {str(e)}"})
        }
