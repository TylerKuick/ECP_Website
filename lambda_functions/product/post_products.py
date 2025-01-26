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
        cursor = connection.cursor()
        
        query = "INSERT INTO products (prod_name, prod_price, description, createdAt, updatedAt) VALUES(%s, %s, %s,now(),now())" 
        cursor.execute(query, (event['prod_name'], event['prod_price'],event['description']))
        connection.commit()
        result = "Post Success"
        
        cursor.close()
        connection.close()
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f"{e}")
        }
    return {
        'statusCode': 200,
        'body': json.dumps(f"{result}")
    }