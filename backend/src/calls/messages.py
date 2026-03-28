INITIAL_MESSAGE = """
Hi, this message will be recorded! 
Please describe your situation!
Backup will be on its way soon!
"""

INCIDENT_EXTRACTION_PROMPT = """
You are an assistant that extracts structured incident data from a phone call transcription.

Return ONLY valid JSON, with no comments or extra text, in this exact schema:

{{
"title": "short human-readable incident title",
"description": "short description of the incident, in natural language",
"report": "detailed report of the incident, with all important details here you should specify what portuguese autorities should do in order to respond as quickly as possible to the incident. how they should move and how they should act. there is no max len so make sure to be extensive here and provide helpful and insightful information for the portuguese authories to handle (Policia, INEM, bombeiros, GNR, Proteção Civil), especially how they should coordinate.",
"lat": 37.7749,
"lon": -122.4194,
"place": "the place for the corresponding longitude. if there is a place u should provide latitude and longitude."
}}

Rules:

* "title" must be under 100 characters.
* "description" must be under 200 characters.
* "report" can be longer and more detailed.
* If the transcription does not clearly specify a location that can be mapped to coordinates, set "lat" and "lon" to null.
* If you infer a location, use realistic coordinates for that location.
* Report must be very detailed and be coordinate all responsible authorities while providing all the important information from the transcription. Like roads to take, alternative roads...
* Always provide a place, latitude and longitude for the given text.
Transcription: {transcription}

"""
