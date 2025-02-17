import json
import boto3

def lambda_handler(event, context):
    # TODO implement
    s3 = boto3.client('s3', region_name="us-east-1")
    
    path_parameters = event.get("pathParameters")
    photoKey = path_parameters.get("photoKey") if path_parameters else None
    body = json.loads(event['body'])
    content_type = body.get("ContentType")
    
    s3Params = {
        'Bucket': "tyler-ecp-project-test",
        'Key': "images/" + photoKey,
        'ContentType': content_type
    }
    response = s3.generate_presigned_url('put_object', Params=s3Params, ExpiresIn=3600)
    
    return {
        'statusCode': 200,
        "headers": {
          "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Methods": "GET,OPTIONS,POST",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        'body': json.dumps(response)
    }