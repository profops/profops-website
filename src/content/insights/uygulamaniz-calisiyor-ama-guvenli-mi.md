---
title: "Uygulamanız Çalışıyor. Peki Gerçekten Güvenli mi?"
description: "Uygulama kodundan CI/CD süreçlerine, container güvenliğinden Kubernetes ve bulut altyapısına uzanan bir mühendislik değerlendirmesi."
publishDate: 2026-11-03
author: "Seda Kurt"
language: "tr"
translationKey: "security-from-code-to-cloud-01"
takeaways:
  - "Başarılı bir deployment, uygulamanın güvenli olduğu anlamına gelmez."
  - "Güvenlik; uygulama, CI/CD, container, Kubernetes ve bulut katmanlarında doğrulanmalıdır."
  - "Kimlik doğrulama tek başına yeterli değildir; yetkilendirme de test edilmelidir."
  - "Sürekli doğrulama, her şeyin güvenli olduğunu varsaymaktan daha güvenilirdir."
category: "Engineering Insights"
tags:
  - Uygulama Güvenliği
  - DevSecOps
  - Container Security
  - Kubernetes
  - Cloud Security
readingTime: 9
featured: true
draft: false
---
## Her Şey Yeşil. Peki İşimiz Bitti mi?

Bir production deployment düşünelim.

CI/CD pipeline başarıyla tamamlandı. Kubernetes üzerindeki tüm pod'lar çalışıyor. Uygulama isteklere sorunsuz yanıt veriyor.

Peki gerçekte neyi doğruladık?

**Başarılı bir deployment, yazılımın beklenen adımlarla dağıtıldığını gösterir. Ancak uygulamanın güvenli olduğunu kanıtlamaz.**

Sağlıklı çalışan bir uygulama ile güvenli bir uygulama her zaman aynı şey değildir. Health check'ler, başarılı build'ler ve çalışan container'lar sistemin operasyonel durumda olduğunu gösterir. Fakat kullanıcıların yetkileri dışındaki verilere erişip erişemediğini, kimlik bilgilerinin açığa çıkıp çıkmadığını veya workload'ların gereğinden fazla yetkiye sahip olup olmadığını tek başlarına söylemezler.

Güvenliği, uygulama kodundan cloud altyapısına kadar tüm yazılım teslim süreci boyunca değerlendirmemiz gerekir.

## 1. Application Security: Kim, Neye Erişebilir?

Uygulama güvenliği, uygulamanın nasıl davrandığını ve kullanıcıların hangi işlemleri gerçekleştirmeye yetkili olduğunu anlamakla başlar.

Örneğin bir API endpoint'imiz olsun:

`GET /api/orders/1042`

Sisteme giriş yapmış bir kullanıcı `1042` numaralı siparişi talep ediyor. Uygulama kullanıcının kimliğini doğruluyor ve sipariş bilgilerini döndürüyor.

Peki kullanıcı sipariş numarasını `1043` olarak değiştirirse ne olur?

Uygulama, siparişin gerçekten o kullanıcıya ait olup olmadığını kontrol etmeden başka bir müşterinin siparişini döndürüyorsa kimlik doğrulama başarılı olmuş, ancak yetkilendirme başarısız olmuştur.

Bu durum, API güvenliğinde karşılaşılan önemli risklerden biri olan **Broken Object Level Authorization (BOLA)** örneğidir.

Authentication, *Sen kimsin?* sorusuna yanıt verir. Authorization ise *Hangi kaynaklara erişmeye yetkilisin?* sorusunu cevaplar.

Her iki kontrol de gereklidir.

> **Biraz Daha Yakından Bakalım**
>
> Bir API'yi incelerken özellikle dikkat edeceğim noktalardan biri, kullanıcının kimliğinin doğrulanmasıyla belirli bir kaynağa erişim yetkisinin birbirinden ayrılması olurdu.
>
> Genellikle bir endpoint'in beklendiği gibi çalışmasına odaklanıyoruz. Ancak kullanıcının erişmemesi gereken bir veriyi talep ettiğinde sistemin nasıl davrandığını görmek de önemli.
>
> İşte burada negative testing devreye giriyor. Bazen en değerli test, bir işlemin başarıyla gerçekleştiğini değil, gerçekleşmemesi gereken bir işlemin doğru şekilde engellendiğini göstermektir.

## 2. CI/CD Security: Deployment Pipeline'ımıza Güvenebilir miyiz?

CI/CD pipeline'ları kaynak koduna, build sistemlerine, deployment kimlik bilgilerine ve bazı durumlarda production ortamlarına erişebilir.

Bu nedenle pipeline'larımız da güvenlik sınırlarımızın bir parçasıdır.

Ele geçirilmiş bir pipeline, uygulama kodunda doğrudan bir güvenlik açığı bulunmasa bile zararlı kodun production ortamına dağıtılmasına neden olabilir.

Şu sorular önemlidir:

- Deployment workflow'larını kimler değiştirebiliyor?
- Production deployment'ları uygun onay mekanizmalarıyla korunuyor mu?
- Secret'lar güvenli şekilde saklanıyor mu?
- Pipeline kimliklerinin ihtiyaçlarından fazla yetkisi var mı?
- Dependency'ler ve build artifact'leri doğrulanıyor mu?

Desteklenen ortamlarda **OpenID Connect (OIDC) ile kısa ömürlü kimlik bilgileri kullanmak**, uzun süre geçerli cloud access key'lerine olan bağımlılığı azaltabilir.

> **Biraz Daha Yakından Bakalım**
>
> Bir geliştiricinin CI/CD workflow'unda küçük bir değişiklik yapmak için pull request açtığını düşünelim. Değişiklik oldukça basit görünüyor ve pipeline kontrollerinin tamamı başarılı.
>
> Peki bu workflow'un gerçekte hangi kaynaklara erişebildiğini düşündük mü?
>
> Ben böyle bir durumda, güvenilmeyen bir pull request'in deployment secret'larına erişip erişemediğini ve pipeline kimliğinin gerçekten ihtiyaç duyduğundan daha fazla yetkiye sahip olup olmadığını incelemek isterdim.
>
> Çünkü uygulamayı güvenli hale getirmek, onu production ortamına taşıyan süreci de korumak anlamına geliyor.

## 3. Container Security: Gerçekte Ne Çalıştırıyoruz?

Container'lar uygulamaların paketlenmesini ve süreçlerin birbirinden izole edilmesini kolaylaştırır. Ancak bir container image'ın kullanılması, uygulamanın otomatik olarak güvenli olduğu anlamına gelmez.

Güvenlik, image'ın içeriğiyle başlar ve container'ın nasıl çalıştırıldığıyla devam eder.

Dikkat etmemiz gereken noktalar:

- Güncel ve bakımı sürdürülen minimal base image'lar kullanmak.
- Image'ları bilinen güvenlik açıklarına karşı taramak.
- Gereksiz paketleri ve araçları image'dan çıkarmak.
- Mümkün olduğunda uygulamaları root olmayan kullanıcılarla çalıştırmak.
- Gereksiz privilege escalation'ı engellemek.
- Kimlik bilgilerini image katmanlarına yerleştirmemek.

Vulnerability scanning yararlıdır, ancak tek başına yeterli değildir. Bulguları gerçek erişilebilirlik, istismar edilebilirlik ve operasyonel koşullar açısından değerlendirmek gerekir.

> **Biraz Daha Yakından Bakalım**
>
> Container olarak paketlediğimiz bir uygulamayı production ortamına aldığımızı düşünelim. Image başarıyla oluşturulmuş, container çalışmaya başlamış ve her şey beklendiği gibi görünüyor.
>
> Ancak ben yine de container'ın hangi yetkilerle çalıştığına bakmak isterdim. Uygulamanın gerçekten root yetkilerine ihtiyacı var mı? Gerekmeyen dosya sistemi alanlarına yazabiliyor mu?
>
> Bir de hangi image sürümünü kullandığımızı ve bu image'ın nereden geldiğini kontrol ederdim. Çünkü container'ın çalışıyor olması, ona yalnızca ihtiyaç duyduğu yetkileri verdiğimiz anlamına gelmiyor.

## 4. Kubernetes Security: Workload'larımız Yeterince Kısıtlanmış mı?

Kubernetes güçlü orchestration yetenekleri sunar. Ancak bu esneklik, beraberinde güvenlik sorumlulukları da getirir.

Bir pod'un çalışıyor olması, o workload'a verilen yetkilerin güvenli olduğunu göstermez.

Örneğin bir pod sağlıklı çalışırken Kubernetes API üzerinde gereksiz yetkilere sahip bir ServiceAccount kullanıyor olabilir.

Kontrol edilmesi gereken alanlardan bazıları:

- Role-Based Access Control (RBAC).
- ServiceAccount yetkileri.
- Pod güvenlik ayarları.
- NetworkPolicy kuralları.
- Secret yönetimi.
- Admission policy'leri ve workload yapılandırmaları.

Her workload'un Kubernetes API'ye erişmesi gerekmez. Aynı şekilde her servisin diğer bütün servislerle iletişim kurabilmesi de gerekli değildir.

**Least privilege (en az yetki) prensibi**, yalnızca kullanıcılar için değil, workload'lar için de uygulanmalıdır.

Pratikte bu; RBAC yetkilerini gözden geçirmek, ihtiyaç duyulmayan durumlarda ServiceAccount token'larının otomatik olarak mount edilmesini engellemek ve cluster'ın network plugin'i destekliyorsa NetworkPolicy kuralları uygulamak anlamına gelir.

Burada önemli bir ayrıntı var: NetworkPolicy tanımlamak tek başına ağ trafiğinin kısıtlandığını garanti etmez. Kullanılan network plugin'in bu kuralları gerçekten desteklemesi ve uygulaması gerekir.

> **Biraz Daha Yakından Bakalım**
>
> Kubernetes cluster'ındaki tüm workload'ların sorunsuz çalıştığını düşünelim. Monitoring ekranlarında olağan dışı bir durum görünmüyor ve her şey yolunda.
>
> Ancak ben bu workload'ların gerçekte neler yapabildiğini de merak ederdim. Örneğin uygulamanın Kubernetes API'ye erişmesi gerçekten gerekiyor mu, yoksa kullandığı ServiceAccount'a zamanında verilmiş ve sonrasında hiç sorgulanmamış yetkiler mi var?
>
> Servislerin birbirleriyle nasıl iletişim kurduğuna ve privileged container kullanımına gerçekten ihtiyaç olup olmadığına da bakardım.
>
> Sağlıklı çalışan bir cluster elbette önemli. Ancak workload'lardan biri ele geçirilirse neler olabileceğini anlamak da en az bunun kadar değerli.

## 5. Cloud Security: Ele Geçirilen Bir Kimlik Ne Kadar İleri Gidebilir?

İyi yapılandırılmış bir uygulama bile gereğinden fazla yetkilendirilmiş cloud kimlikleri veya hatalı altyapı ayarları nedeniyle risk altında olabilir.

Cloud güvenliğinde temel konulardan biri, hangi kimliğin hangi kaynaklara erişebildiğini anlamaktır.

Örneğin bir workload'un yalnızca belirli bir storage alanındaki dosyaları okuması gerektiğini düşünelim.

Eğer bu workload'un kimliği başka storage alanlarını değiştirebiliyor, yeni altyapı kaynakları oluşturabiliyor veya diğer kimlikleri yönetebiliyorsa olası bir güvenlik ihlalinin etkisi çok daha büyük olabilir.

Önemli kontrol alanları:

- Identity and Access Management (IAM).
- Least-privilege yetkilendirme.
- Network erişim kuralları.
- Storage erişim kontrolleri.
- Encryption ve key management.
- Audit logging ve monitoring.
- Infrastructure-as-Code incelemeleri.

Amaç, tek bir yapılandırmayla bütün riskleri ortadan kaldırmak değildir. Gereksiz erişimleri azaltmak ve şüpheli aktivitelerin tespit edilebilir olmasını sağlamaktır.

## 6. Güvenlik Sürekli Doğrulama Gerektirir

Güvenlik, başarılı bir deployment sonrasında kalıcı olarak tamamlanan bir kontrol listesi değildir.

Uygulamalar değişir. Dependency'ler güncellenir. Altyapı gelişir. Yeni güvenlik açıkları keşfedilir.

Pratik bir mühendislik yaklaşımı, önleyici kontrolleri sürekli doğrulamayla birleştirir:

- Kod ve altyapı değişikliklerini gözden geçirmek.
- Authentication ve authorization davranışlarını test etmek.
- Dependency ve container image taramaları yapmak.
- Deployment yapılandırmalarını doğrulamak.
- Workload davranışlarını izlemek.
- Yetkileri düzenli olarak gözden geçirmek.
- Güvenlik bulgularını gerçek risklerine göre değerlendirmek.

**Asıl soru yalnızca uygulamamızın çalışıp çalışmadığı değildir. Uygun güvenlik kontrollerinin gerçekten çalıştığını gösteren kanıtlara sahip olup olmadığımızdır.**

## Sırada Ne Var?

Bu yazıda cloud-native uygulamaların geliştirilmesi ve production ortamına taşınması sırasında dikkate almamız gereken güvenlik sınırlarını ele aldık.

Bir sonraki uygulamalı ProfOps Lab çalışmasında küçük bir uygulama, CI/CD workflow'u, container image ve pratik güvenlik kontrolleri üzerinden bu konuları inceleyeceğiz.

Amacımız güvenlik kontrollerini yalnızca anlatmak değil, gerçek örneklerle nasıl doğrulayabileceğimizi göstermek.

## Kaynaklar ve İleri Okuma

- [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- [GitHub Actions — OpenID Connect](https://docs.github.com/en/actions/concepts/security/openid-connect)
- [Kubernetes — Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
- [Kubernetes — Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
- [NIST Secure Software Development Framework](https://csrc.nist.gov/projects/ssdf)