---
title: "Your Application Is Running. But Is It Secure?"
description: "A practical engineering perspective on application security, CI/CD, containers, Kubernetes, and cloud infrastructure."
publishDate: 2026-11-03
author: "Seda Kurt"
language: "en"
translationKey: "security-from-code-to-cloud-01"
takeaways:
  - "A successful deployment does not mean an application is secure."
  - "Security must be verified across application, CI/CD, container, Kubernetes, and cloud layers."
  - "Authentication alone is not enough; authorization must be tested."
  - "Continuous verification is more reliable than assuming everything is safe."
category: "Engineering Insights"
tags:
  - Application Security
  - DevSecOps
  - Container Security
  - Kubernetes
  - Cloud Security
readingTime: 9
featured: true
draft: false
---
## Everything Is Green. Are We Done?

Imagine a production deployment.

The CI/CD pipeline is green. Kubernetes reports that all pods are running. The application responds successfully.

But what have we actually verified?

**A successful deployment proves that our delivery process completed its expected steps. It does not prove that our application is secure.**

A healthy application and a secure application are not necessarily the same thing. Health checks, successful builds, and running containers tell us that a system is operational. They do not automatically tell us whether users can access data they should not see, whether credentials are exposed, or whether workloads have unnecessary privileges.

Security needs to be considered across the entire delivery path, from application code to cloud infrastructure.

## 1. Application Security: Who Can Access What?

Application security begins with understanding how the application behaves and what its users are allowed to do.

Consider an API endpoint:

`GET /api/orders/1042`

A logged-in user requests order `1042`. The application checks whether the user is authenticated and returns the order.

But what happens if the user changes the identifier to `1043`?

If the application returns another customer's order without checking ownership, authentication has succeeded while authorization has failed.

This is an example of **Broken Object Level Authorization (BOLA)**, a common API security risk.

Authentication answers *Who are you?* Authorization answers *What are you allowed to access?*

Both checks matter.

> **A Closer Look**
>
> When reviewing an API, I'd pay particular attention to the difference between a user being authenticated and being authorized to access a specific resource.
>
> It's easy to focus on whether an endpoint works as expected. But I'd also want to understand how it behaves when someone requests data they shouldn't be able to access.
>
> That's where negative testing becomes valuable. Sometimes the most revealing test isn't whether something works, but whether something that shouldn't work is correctly rejected.

## 2. CI/CD Security: Can We Trust the Delivery Pipeline?

A CI/CD pipeline has access to source code, build systems, deployment credentials, and sometimes production environments.

That makes the pipeline part of the security boundary.

A compromised pipeline can potentially deploy malicious code even when the application itself has no obvious vulnerability.

Important questions include:

- Who can modify deployment workflows?
- Are production deployments protected by appropriate approvals?
- Are secrets stored securely?
- Do pipeline identities have more permissions than they need?
- Are dependencies and build artifacts verified?

Where supported, **short-lived credentials using OpenID Connect (OIDC)** can reduce reliance on long-lived cloud access keys.

> **A Closer Look**
>
> Imagine a developer opens a pull request to update a CI/CD workflow. The change looks small, and all pipeline checks pass.
>
> But have we considered what that workflow can actually access?
>
> I'd want to understand whether an untrusted pull request could expose deployment secrets or whether the pipeline's identity has permissions beyond what it needs.
>
> After all, securing an application also means protecting the process that delivers it to production.

## 3. Container Security: What Is Actually Running?

Containers provide packaging and process isolation, but a container image is not automatically secure.

Security starts with the image itself and continues with how the container runs.

We should consider:

- Using maintained and minimal base images.
- Scanning images for known vulnerabilities.
- Avoiding unnecessary packages and tools.
- Running applications as non-root users where possible.
- Preventing unnecessary privilege escalation.
- Avoiding embedded credentials in image layers.

A vulnerability scan is useful, but it is only one signal. Findings need to be evaluated based on exploitability, exposure, and operational context.

> **A Closer Look**
>
> Imagine deploying a containerized application. The image builds successfully, the container starts, and everything appears to be working as expected.
>
> But I'd still want to know how that container is running. Does the application really need root privileges? Can it write to parts of the filesystem it shouldn't need?
>
> I'd also check which image version we're deploying and where it came from. A running container tells us the application has started, but not whether we've given it more access than it actually needs.

## 4. Kubernetes Security: Are Workloads Properly Restricted?

Kubernetes provides powerful orchestration capabilities, but its flexibility introduces security responsibilities.

A running pod tells us very little about the permissions granted to its workload.

For example, a pod may be healthy while using a ServiceAccount with unnecessary access to the Kubernetes API.

Areas worth reviewing include:

- Role-Based Access Control (RBAC).
- ServiceAccount permissions.
- Pod security settings.
- NetworkPolicies.
- Secret management.
- Admission policies and workload configuration.

Not every workload needs access to the Kubernetes API. Not every service needs to communicate with every other service.

The principle of least privilege should apply to workloads as well as people.

In practice, this means reviewing RBAC permissions, disabling automatic ServiceAccount token mounting where it isn't needed, and using NetworkPolicies when supported by the cluster's network plugin.

One important detail is that defining a NetworkPolicy doesn't automatically guarantee traffic isolation. The cluster's network plugin must support and enforce these policies.

> **A Closer Look**
>
> Imagine reviewing a Kubernetes cluster where all workloads are running smoothly. Nothing looks unusual, and the monitoring dashboards are green.
>
> But I'd be curious about what those workloads are actually allowed to do. For example, does an application really need access to the Kubernetes API, or has its ServiceAccount been granted permissions that nobody has questioned?
>
> I'd also look at how services communicate with each other and whether privileged containers are allowed without a clear reason.
>
> A healthy cluster is a good starting point, but understanding what happens if one workload is compromised is just as important.

## 5. Cloud Security: How Far Can a Compromised Identity Reach?

Even a well-configured application can be exposed through overly permissive cloud identities or infrastructure settings.

Cloud security requires understanding which identities can access which resources.

Consider a workload that needs to read objects from one storage location. If its identity can also modify unrelated storage, create infrastructure, or manage other identities, a compromise may have a much larger impact.

Key areas include:

- Identity and Access Management (IAM).
- Least-privilege permissions.
- Network exposure.
- Storage access controls.
- Encryption and key management.
- Audit logging and monitoring.
- Infrastructure-as-Code reviews.

The goal is not to eliminate every possible risk with a single configuration. It is to reduce unnecessary access and make suspicious activity observable.

## 6. Security Is Continuous Verification

Security is not a checkbox that becomes permanently complete after a successful deployment.

Applications change. Dependencies change. Infrastructure changes. New vulnerabilities are discovered.

A practical engineering approach combines preventive controls with ongoing verification:

- Review code and infrastructure changes.
- Test authentication and authorization behavior.
- Scan dependencies and container images.
- Validate deployment configuration.
- Monitor workload behavior.
- Review permissions regularly.
- Investigate findings based on actual risk.

**The important question is not simply whether our application is running. It is whether we have evidence that the right security controls are working.**

## What's Next?

This article introduces the security boundaries we should think about when delivering cloud-native applications.

In the next hands-on ProfOps Lab, we will explore these ideas using a small application, a CI/CD workflow, a container image, and practical security checks.

The goal will be to move from discussing security controls to verifying them with real examples.

## Further Reading

- [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- [GitHub Actions — OpenID Connect](https://docs.github.com/en/actions/concepts/security/openid-connect)
- [Kubernetes — Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
- [Kubernetes — Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
- [NIST Secure Software Development Framework](https://csrc.nist.gov/projects/ssdf)