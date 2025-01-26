import pymysql
import json
import boto3

def lambda_handler(event, context):
    rds = boto3.client('rds')
    rds_obj = rds.describe_db_instances(DBInstanceIdentifier="ecp-rds")
    
    endpoint = rds_obj['DBInstances'][0]["Endpoint"]["Address"] # get using boto3
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
        connection.ping(reconnect=True)
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        
        query = "INSERT INTO products (prod_name, prod_price, description, createdAt, updatedAt) VALUES(%s, %s, %s,now(),now())" 
        cursor.execute(query, (event['prod_name'], event['prod_price'],event['description']))
        connection.commit()
        result = "Post Success"
        
        return {
            'statusCode': 201,
            'body': json.dumps(f"{result}")
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Failed to fetch data: {str(e)}"})
        }
    finally:
        if connection: 
            connection.close()