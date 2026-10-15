"""Polza media generation: one request, poll, download. Key from ../.env (POLZA_API_KEY), never printed.
usage: python3 -I tools/polza.py MODEL PROMPT_FILE OUT_FILE [image|video.mp4 ...] [--opt key=value ...]"""
import base64, json, mimetypes, sys, time, urllib.request
from pathlib import Path

ENV = Path(__file__).resolve().parents[2] / '.env'
KEY = next(l.split('=', 1)[1].strip() for l in ENV.read_text().splitlines() if l.startswith('POLZA_API_KEY='))
API = 'https://polza.ai/api/v1/media'

def call(url, body=None):
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body else None,
                                 headers={'Authorization': f'Bearer {KEY}', 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.load(r)

def main():
    args = sys.argv[1:]
    opts = {}
    if '--opt' in args:
        i = args.index('--opt'); opts = dict(kv.split('=', 1) for kv in args[i + 1:]); args = args[:i]
    model, prompt_file, out, *images = args
    inp = {'prompt': Path(prompt_file).read_text().strip(), **opts}
    # Inputs go to Polza storage (kept 24 h) and are passed by URL: video references only accept URLs.
    upload = lambda p: {'type': 'url', 'data': call(API.replace('/media', '/storage/upload'), {'base64': base64.b64encode(Path(p).read_bytes()).decode(), 'mimeType': mimetypes.guess_type(p)[0]})['url']}
    videos = [p for p in images if p.endswith('.mp4')]
    images = [p for p in images if p not in videos]
    if videos:
        inp['videos'] = [upload(p) for p in videos]
    if images:
        inp['images'] = [upload(p) for p in images]
    print('inputs', {k: [x['data'] for x in inp[k]] for k in ('images', 'videos') if k in inp}, flush=True)
    job = call(API, {'model': model, 'input': inp})
    print('job', job.get('id'), job.get('status'), flush=True)
    while job.get('status') not in ('completed', 'failed'):
        time.sleep(8)
        try:
            job = call(f"{API}/{job['id']}")
        except OSError as e:  # network timeout while polling: the job keeps running, poll again
            print('poll retry', e, flush=True)
    if job['status'] == 'failed':
        sys.exit(f"failed: {job.get('error')}")
    data = job['data']
    url = data['url'] if isinstance(data, dict) else data[0]['url']
    urllib.request.urlretrieve(url, out)
    print('saved', out, 'cost_rub', job.get('cost_rub', job.get('cost')), flush=True)

main()
