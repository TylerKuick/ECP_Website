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
    
    sns = boto3.client('sns')
    SNS_TOPIC_ARN = os.environ['SNS_TOPIC_ARN']
    try: 
        connection = pymysql.connect(host=endpoint, user=username, password=password, db=database_name)
    except Exception as e: 
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Database connection failed: {str(e)}"})
        }
        
    try:
        # Send SNS Notification for new product being added
        message = f"""
        New product has been added! 
        
        Product Name: {event['prod_name']}
        Price: {event['prod_price']}
        """
        sns.publish(TopicArn=SNS_TOPIC_ARN, Message=message, Subject="New Product Alert!")
    except Exception as e: 
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"SNS failed: {str(e)}"})
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