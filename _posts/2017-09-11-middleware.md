---
layout: post
title:  "Middleware"
date:   2017-09-11 11:16:36 -0500
categories: 
---

What is middleware? I was initially confronted with this question when developing a web application in Clojure without a framework. Many web developers, myself included, work solely at the application layer and are usually even further insulated from the server (not to mention lower level system services) by a framework. Thinking about middleware forces one to step outside the application for a moment, and think about the broader system. 

### The application, and the platform

The first thing that was useful was to reflect on some terms. The first one, which is obvious, is the **application**. This is a custom program that provides a set of functionalities to a user. In a computer system, the application is the most visible piece.

But the application rarely lives in a vacuum. It runs on some environment, or  **platform.** The platform forms an abstraction layer that provides services to the application. It is responsible for launching (and terminating) the application program. It services requests to and from the application. And it provides the environment in which the application executes.

### The nature of services provided by the platform

Because the platform is often intended to support a variety of applications, each with different (and often unanticipated) needs, the services the platform provides are usually low-level and granular in order to support a variety of use cases. On a mobile platform, for example, an application might care about using the camera for still photography. Another may seek to use the camera for video. Yet another may want to use the flash functionality without regard for the camera at all. In order to support these various use cases, the mobile platform must provide these services at a granular level.

### The gap between the application and the platform

The challenge for application developers is that the services provided by the platform are not always at the level they want to be concerned with. The services might be too low-level, or the developer may want some augmented functionality not native to the platform.

This gap - between application needs and platform services is what makes room for middleware. In the case of a web application, for example, the web server may not provide any functionality beyond simply calling the main method of the web application with the request parameters, and sending the output of the application as a response to the client. A web application developer may want other, general services - the ability to route requests to different applications, for example. Or to compress files returned as responses.

So the solution would be to write software that sits between the platform and application. This is precisely what middleware is. 
