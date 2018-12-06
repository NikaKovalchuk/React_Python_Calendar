from marshmallow import Schema, fields

class EventSchema(Schema):
    id = fields.Int(required=True)
    title = fields.Str(required=True, max_length=100)
    text = fields.Str(max_length=1000)

    create_date = fields.DateTime(dump_to='createdtDate', required=True)
    start_date = fields.DateTime(dump_to='startDate')
    update_date = fields.DateTime(dump_to='updateDate')
    finish_date = fields.DateTime(dump_to='finishDate')

    status = fields.Int()
    price = fields.Int()

    delete = fields.Boolean()
    delete_date = fields.DateTime(dump_to='deleteDate')