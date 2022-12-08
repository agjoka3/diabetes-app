### Architecture Diagram

diabetes-app is build using Qwik Framework and than Firestore is used to store the data and also to authenticate users. Frontend pages generated with Qwik are server side rendered. 

```flow
fe=>operation: Qwik Application
be=>operation: Firestore SDK & Authentication

fe->be
```