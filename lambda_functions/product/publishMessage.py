import json
import boto3 
import pymysql
import os 

sns = boto3.client("sns", region_name="us-east-1")
SNS_TOPIC_ARN = os.environ['SNS_TOPIC_ARN']

endpoint = os.environ['DB_HOST']
username = "admin" 
password = "password" 
database_name = "ecp_dev" 

def lambda_handler(event, context):
    # TODO implement
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

        query = f"SELECT * FROM products WHERE createdAt >= NOW() - INTERVAL 1 DAY" 
        cursor.execute(query)
        rows = cursor.fetchall()

        if rows: 
            for item in rows: 
                message = "New Product Added: \n"
                message += f"{item} \n" 
            sns.publish(TopicArn = SNS_TOPIC_ARN, Message = message, Subject="New Product Alert!")
        
            cursor.close()
            connection.close()
            return {
                'statusCode': 200,
                'body': json.dumps('Successfully published SNS Message')
            }
        cursor.close()
        connection.close()
        return {
            "statusCode": 200,
            "body": json.dumps('No Items!')
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Failed to fetch data: {str(e)}"})
        }
