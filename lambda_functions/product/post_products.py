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

    connection = pymysql.connect(host=endpoint, user=username, password=password, db=database_name)
    cursor = connection.cursor()
    if (cursor): 
        query = "INSERT INTO Products (prod_name, prod_price, description) VALUES(%s, %s, %s)" 
        cursor.execute(query, (event['prod_name'], event['prod_price'],event['description']))
        connection.commit()
        result = "Success"
    else: 
        result = "Failed"
    cursor.close()
    connection.close()
    return {
        'statusCode': 200,
        'body': json.dumps(f"{result}")
    }