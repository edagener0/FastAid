# FastAid

This project was developed during our participation in the [Tecstorm Hackathon](https://www.tecstorm.pt/).

## Table Of Contents
- [FastAid](#fastaid)
  - [Table Of Contents](#table-of-contents)
  - [Pitch](#pitch)
  - [About](#about)
    - [Inspiration](#inspiration)
    - [What it does](#what-it-does)
    - [How we built it](#how-we-built-it)
    - [Challenges we ran into](#challenges-we-ran-into)
    - [Accomplishments we're proud of](#accomplishments-were-proud-of)
    - [What we learned](#what-we-learned)
    - [What's next for FastAid](#whats-next-for-fastaid)
  - [Executing from source code](#executing-from-source-code)

## Pitch

Our goal is to optimize the national health service through an application that enables efficient contact with emergency services by integrating artificial intelligence into the communication process.

## About

### Inspiration

The national health service is in decline, which contributes to widespread dissatisfaction among the population.

### What it does

The application enables easy management of national health service resources, allowing operators (Firefighters, Police, Emergency Medical Services, Civil Protection, etc.) to coordinate responses to incidents.

The application features an interactive map where all ongoing incidents can be viewed and updated in real time.

It also includes a dashboard that allows operators to quickly see the number of available personnel and the types of incidents occurring.

Additionally, the application provides a dedicated number that citizens can call in case of emergencies. When a call is made, a generic message informs the caller that the emergency services have received their request and reinforcements will be dispatched shortly. The call is recorded, and the caller then communicates with an AI system, providing all necessary information. The AI is responsible for creating the incident report and allocating the appropriate resources for its resolution.

### How we built it

The backend was developed in Python using Django Rest Framework.
The frontend was built with TypeScript using React.
Twilio was used to handle phone call functionality.
To transcribe calls and create incident reports, we integrated the Gemini Pro API with Twilio.

### Challenges we ran into

Integrating the application with Twilio and the Gemini API was particularly challenging.
It was necessary to create an API endpoint responsible for transcribing calls, parsing the content, analyzing it with AI, and finally creating the incident report.

### Accomplishments we're proud of

We are extremely proud of the work we have accomplished! Developing this application was challenging, but we strongly believe the idea has great potential given the decline of the national health system.
We see it as a solution that could improve overall societal efficiency, and successfully bringing it to life is something we take pride in.

### What we learned

We gained extensive experience with REST APIs and frontend development. Additionally, we learned how to connect a frontend to a backend, and how to work with external APIs, specifically Gemini and Twilio.
Integrating phone calls and artificial intelligence into the application was especially insightful.

### What's next for FastAid

We believe FastAid could represent the future of the national health system.
Our goal is to integrate the application across all Fire Departments, Police Stations, Hospitals, and other emergency services, centralizing the system to make it more dynamic, responsive, and efficient for all Portuguese citizens.

## Executing from source code

1. Download the source code
```bash
git clone https://github.com/edagener0/FastAid.git
```
2. Open a new terminal, create a virtual environment, install dependencies and execute the backend.
```bash
cd FastAid/backend
python3 -m venv .venv
pip install -r requirements.txt
cd fastaid
python3 manage.py runserver
```
3. Open a new terminal, install the dependencies and execute the frontend.
```bash
cd FastAid/frontend/fastaid
npm install
npm run dev
```
4. Route your application API's traffic through a cloudflare tunnel (remember that django rest framework runs by default on port 8000)
```bash
cloudflared tunnel --url http://localhost:8000
``` 
5. Register an account on Twilio with free trial.
6. Buy a US phone number with the free credits since it's the cheapest.
7. Add the endpoint as a phone number webhook: https://{cloudflare_domain}/calls/receive/
8. The application is ready.