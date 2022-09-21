# ENPICOM Software Engineer Technical Assessment

## Instructions

Hello there! If you have been asked to complete this technical assessment, that means we
believe you are a promising candidate for one of our open vacancies.

We have provided you with a working template project, to save some time.
Of course if you prefer, feel free to delete the files and start from scratch.

You might have to make assumptions about the requirements, please write them down.
Please fork this repository, push your implementation and provide us with the link when you're finished.

Here's what we would like you to do:

### Server

Please refer to server [README](./server/README.md) for info.

### Client

Please refer to server [README](./server/README.md) for info.

### Open Question

Suppose you had to turn the above components into a production web application consumed by many concurrent users and
handling large volumes of data. What would you have to change/improve in order to achieve that?

I think it would largely depend on what kind of quality attributes will be picked for a given application and what are the expectations for number of concurrent users and how large are volumes of data. But I will list just generic things that I will do for any application.

1. Creating a stable and fast CI/CD pipeline. That could be done as the first thing, even before writing any business logic. It will allow to safely and fast deploy new changes and get feedback from the users.

2. Improving security of the application, since it's non-existent at this point.
Security improvements:
- move application from HTTP to HTTPS, either in application itself or with help of reverse proxy
- use `helmet` middleware
- introduce some authorization

3. Add index to `enpicom.sequence`, to speed up search.

4. Replication for Postgres, to navigate write queries to leader and read queries to followers.

5. Introduce autoscaling for application server. This will keep the right amount of instances for current user count (low/high times).

6. Improve validation, logging and development experience in general.
