import json
import requests

from notebook.base.handlers import IPythonHandler

class SchedulerHandler(IPythonHandler):

    def get(self):
        msg_json = dict(title="Operation not supported.")
        self.write(msg_json)
        self.flush()

    def post(self, *args, **kwargs):
        url = 'http://localhost:5000/scheduler/tasks'

        payload = {}
        payload['notebook'] = self.get_json_body()

        #TODO: don't send cell outputs to optimize bandwith
        #for cell in payload['notebook']['cells']:
        #    del cell['outputs']

        requests.post(url=url, data=json.dumps(payload))

        msg_json = dict(title="Job submitted to scheduler Successfully!")
        self.write(msg_json)
        self.flush()