import pymysql
import boto3
import json

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
        id_str = event.get("id")
        
        if id_str is not None | "":
            query = "DELETE FROM products WHERE ID=%s" 
            cursor.execute(query, (id_str))
            connection.commit()
            result = "Deleted Successfully"
        else: 
            result = "No id_str found"
    except: 
        result = "Delete Failed"
    cursor.close()
    connection.close()

    return {
        'statusCode': 200,
        'body': json.dumps(f"{result}")
    }
