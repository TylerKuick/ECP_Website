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
            query = "UPDATE products SET prod_name=%s prod_price=%s description=%s WHERE ID=%s" 
            cursor.execute(query, (event['prod_name'], event['prod_price'],event['description'], (id_str)))
            connection.commit()
            result  = "Updated Successfully"
        else: 
            result = "No id_str found"
    except: 
        result = "Update Failed"
    cursor.close()
    connection.close()
    return {
        'statusCode': 200,
        'body': json.dumps(f"{result}")
    }