import pymysql
import boto3

rds = boto3.client('rds')
rds_obj = rds.describe_db_instances(DBInstanceIdentifier="ecp-rds")

endpoint = rds_obj['DBInstances'][0]["Endpoint"]["Address"] # get using boto3
username = "admin" 
password = "password" 
database_name = "ecp_dev" 

connection = pymysql.connect(endpoint, user=username, passwd=password, db=database_name)


def handler(event, context):
    cursor = connection.cursor()
    query = "" 
    cursor.execute(query)

    rows = cursor.fetchall()
    for row in rows: 
        print(f'{row[0]}, {row[1]}, {row[2]}')  # Replace with JSON object later