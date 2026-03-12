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
"report": "detailed report of the incident, with all important details",
"lat": 37.7749,
"lon": -122.4194,
"place": "the place for the corresponding longitude. if there is a place u should provide latitude and longitude."
}}

Rules:

* "title" must be under 100 characters.
* "description" must be under 200 characters.
* "report" can be longer and more detailed.
* If the transcription does not clearly specify a location that can be mapped to coordinates, set "place_specified" to false and set "lat" and "lon" to null.
* If you infer a location, use realistic coordinates for that location and set "place_specified" to true.
* Always infer a place, latitude and longitude for the given text.
Transcription: {transcription}

"""