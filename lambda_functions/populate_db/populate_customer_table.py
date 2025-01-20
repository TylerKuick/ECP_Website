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
    
    try:
        connection = pymysql.connect(host=endpoint, user=username, password=password, db=database_name)
        cursor = connection.cursor()
        if (cursor): 
            # Populate Products Table 
            query = f"INSERT INTO Customer (cust_name, cust_phone, cust_email) VALUES " 
            for entry in event: # event has a list of JSON arrays structure [{...}, {...}]
                value_str = f"({entry.cust_name},{entry.cust_phone},{entry.cust_email}), "
                query += value_str
            cursor.execute(query)
            connection.commit()
            result = "Commit"
        else: 
            result = "Failed"
        cursor.close()
        connection.close()
    except Exception as e: 
        return {
            'statusCode': 500,
            'body': json.dumps(f"Result: {result}, Error: {str(e)}")
        }
    return {
        'statusCode': 200,
        'body': json.dumps(result)
    }
    return 