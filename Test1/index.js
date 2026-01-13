function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        document.head.appendChild(script);
    });
}
function loadStyle(href) {
    return new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        document.head.appendChild(link);
    });
}
function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const timer = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(timer);
                resolve(el);
            }
            if (Date.now() - start > timeout) {
                clearInterval(timer);
                reject('Element not found');
            }
        }, 100);
    });
}



const listContent = [
    {
        boldText: 'Cloud-Based SBC.',
        text: 'Transition to a Session Border Controller in a secure, scalable cloud. No hardware. Multiple signaling protocols. '
    },
    {
        boldText: 'IP & Optical Networks.',
        text: 'Transport services intelligently according to their performance needs. Lowest TCO in the industry.'
    },
    {
        boldText: 'Network Analytics.',
        text: 'Real-time data across access technologies, services, protocols, end-to-end applications, and subscribers.'
    },
];

const accordion = [
    {
        heading: 'Session Border Controllers',
        text1: 'Transition SBCs to a scalable cloud. Multiple signaling protocols. No hardware. Route calls to IP phones, softphones, mobile phones, analog devices, UC clients, contact centers, and other SIP endpoints.',
        text2: 'Best-in-class security, including firewall access control and encryption. Provide overload controls to prevent volume spikes and DoS attacks.',
        image: 'https://res.cloudinary.com/dcsohyepb/image/upload/v1766592844/Frame_1171275531-1_x3bbko.png',
        link: ''
    },
    {
        heading: 'IP & Optical',
        text1: 'Get secure, scalable bandwidth across your IP and optical networks. Up to 1.2T capacity. Transport services according to their performance needs with multi-layer route diversity.',
        text2: 'IP routers for Unified 5G xHaul, broadband backhaul, and SDH/SONET modernization. ',
        image: 'https://res.cloudinary.com/dcsohyepb/image/upload/v1766592838/Frame_1171275516-3_dcqabm.png',
        link: ''
    },
    {
        heading: 'VoIP Communications',
        text1: 'Deliver real-time, cloud-based communication services over private, public, and hybrid environments.',
        text2: 'Provide fast, secure voice service routing and policy control. Enable voice call & session management, service assurance, network monitoring, and voice fraud prevention.',
        image: 'https://res.cloudinary.com/dcsohyepb/image/upload/v1766592838/Frame_1171275514-4_tvucdu.png',
        link: ''
    },
    {
        heading: 'Analytics',
        text1: 'Analyze network performance in real time, including traffic volume, speed, latency, and packet loss. Understand long-term trends for capacity planning and network optimization. Out-of-the-box applications.',
        text2: 'Advanced QoS management and SLA monitoring. Track KPIs across infrastructure, service, compliance, and more.',
        image: 'https://res.cloudinary.com/dcsohyepb/image/upload/v1766592839/Frame_1171275522-1_cugtwv.png',
        link: ''
    },
    {
        heading: 'Media Gateways',
        text1: 'Enable VoLTE and IMS media integration with advanced transcoding capabilities. VoIP services and multimedia communications.',
        text2: 'Integrate seamlessly between IP and circuit-switched networks. Ensure smooth transitions and connectivity. Consolidate and modernize traditional telecommunications. High scalability and interoperability.',
        image: 'https://res.cloudinary.com/dcsohyepb/image/upload/v1766592840/Frame_1171275532-3_xxmavf.png',
        link: ''
    },
    {
        heading: 'Security',
        text1: 'Advanced security and fault management, including monitoring alerts, automated diagnostics, and failover mechanisms. Distribute threat intelligence policies across devices. Respond faster and eliminate gaps in security infrastructure.',
        text2: 'Identify and block TDoS attempts. Detect and prevent fraud, robocalls, and spam.',
        image: 'https://res.cloudinary.com/dcsohyepb/image/upload/v1766592840/Frame_1171275532-4_fe3s5x.png',
        link: ''
    }
];

const testimonials = [
    {
        text: `"Versatile SIP and VoIP functions. Their hardware and software easily integrated with our system and yielded millions of dollars in annual savings. We couldn't be happier."`,
        authorImage: 'https://res.cloudinary.com/dcsohyepb/image/upload/v1766592827/Ellipse_2144_dajeql.png',
        authorName: 'Ross McElroy',
        authorDesignation: 'Dir. UC & Collaboration',
        brandLogo: 'https://res.cloudinary.com/dcsohyepb/image/upload/v1766592847/Mask_group_wtj5bl.png'
    },
    {
        text: '"Ribbon has been a trusted partner since 2004, and their proven track record gives us confidence that they will successfully manage this upgrade. This compact, robust IP/MPLS-Access solution from Ribbon will both serve our current needs and make the Airtel network 5G ready"',
        authorImage: 'https://res.cloudinary.com/dcsohyepb/image/upload/v1766592827/Ellipse_2144-2_yamp7w.png',
        authorName: 'Randeep Sekhon',
        authorDesignation: 'CTO',
        brandLogo: 'https://res.cloudinary.com/dcsohyepb/image/upload/v1766592854/airtel-red_1-1_pfvfpu.svg'
    },
];

const industries = [
    {
        title: 'Service Providers',
        image: 'https://res.cloudinary.com/dcsohyepb/image/upload/v1766592831/Frame_1000003764-6_ietq3a.png',
        text1: 'Transition networks to cloud-based and other high-capacity infrastructure. Custom solutions for telco, mobile, wireline, wholesale, rural broadband, cable, and more.',
        text2: 'Ensure seamless multimedia transition between 4G & 5G with a common IMS core. Supports unified 5G xhaul, broadband backhaul, and SDH/SONET modernization.',
    },
    {
        title: 'Enterprise',
        image: 'https://res.cloudinary.com/dcsohyepb/image/upload/v1766592831/Frame_1000003764-4_umopms.png',
        text1: 'Best-in-class IP solutions, including converged multi-access edge, service-aware routing, and end-to-end IP optical integration.',
        text2: 'Unlimited optical bandwidth with ultra-low latency. Advanced encryption for all traffic, including voice, video, and data.',
        text3: 'Cloud-based SBCs. Enterprise security for SIP trunks, cloud UC services, contact centers, PBXs, media servers, etc.',
    },
    {
        title: 'Critical Infrastructure',
        image: 'https://res.cloudinary.com/dcsohyepb/image/upload/v1766592832/Frame_1000003764-8_gov6i5.png',
        text1: 'Provide secure, high-capacity IP and Optical networking for critical infrastructure, including government, defense, rail, and utilities.',
        text2: 'Transition traditional TDM to IP/MPLS. Migrate legacy PBX systems to the latest VoIP technology. FIPS compliant and JITC certified.',
    },
]

// Add class in body
document.querySelector('body').classList.add('ribbon-test');

// Hero section
document.querySelector('.region-banner .container .row > div').classList.add('left-wrapper');
document.querySelector('.region-banner .container .row .left-wrapper > div').classList.add('old-list-content');

document.querySelector('h1.block-title-huge').insertAdjacentHTML('afterend', '<div class="review-wrapper"><img src="https://res.cloudinary.com/dcsohyepb/image/upload/v1766592829/Frame_1000003739-1_ptnzeq.png" alt="review image"/></div>')

let newListContentElem = document.createElement('div');
newListContentElem.classList.add('new-list-content', 'subtitle', 'aos-init', 'aos-animate');
document.querySelector('.region-banner .container .row .left-wrapper .old-list-content').before(newListContentElem);
document.querySelector('.region-banner .container .row .left-wrapper .new-list-content').innerHTML = '<ul></ul>';

let list = '';
const newListContentText = listContent.map((listText) => {
    list = list + `<li><b>${listText.boldText}</b> ${listText.text}</li>`
});

document.querySelector('.region-banner .container .row .left-wrapper .new-list-content ul').innerHTML = list;

document.querySelector('.ribbon-splash-lottie').insertAdjacentHTML('afterbegin', '<img src="https://res.cloudinary.com/dcsohyepb/image/upload/v1766592840/Group_19231-1_pbzyp5.png" alt="hero-image" />')

const heroClientImages = `
<div class="hero-client-images-wrapper desktop"><img src="https://res.cloudinary.com/dcsohyepb/image/upload/v1766592828/Frame_1000003700-1_c9c5bl.png" alt="hero-client-images" /></div>
<div class="hero-client-images-wrapper tablet"><img src="https://res.cloudinary.com/dcsohyepb/image/upload/v1766592826/Frame_1000003575_s77o40.png" alt="hero-client-images" /></div>
<div class="hero-client-images-wrapper mobile"><img src="https://res.cloudinary.com/dcsohyepb/image/upload/v1766592826/Frame_1000003577_ryn6ph.png" alt="hero-client-images" /></div>`
document.querySelector('.trusted-intro').insertAdjacentHTML('afterend', heroClientImages);

// According section
const accordionSection = document.createElement('section');
accordionSection.classList.add('accordion-section');
document.querySelector('.universal').after(accordionSection);

let accordionTabs = '';
let accordionContent = '';
const accordionText = accordion.map((tab) => {
    accordionTabs = accordionTabs + `
        <div class="accordion-image">
            <img src="${tab.image}" alt="${tab.heading}" />
        </div>`;

    accordionContent = accordionContent + `
        <div class="accordion">
            <div class="accordion-header">
                ${tab.heading}
                <span class="arrow"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M3.77 6.11499L2 7.88499L12 17.885L22 7.88499L20.23 6.11499L12 14.345L3.77 6.11499Z" fill="black"/>
</svg></span>
            </div>

            <div class="accordion-body">
                <p>
                    ${tab.text1}
                </p>
                <p>
                    ${tab.text2}
                </p>

                <div class="actions">
                    <a class="btn rbbn_button" href="#">Learn More</a>
                    <a class="btn rbbn_button fp-splash-btn mfp-iframe pardot-popup btn-primary" href="#">Contact Us</a>
                </div>
                <div class="accordion-image">
                    <img src="${tab.image}" alt="${tab.heading}" />
                </div>
            </div>
        </div>`
    return accordionTabs;
});
accordionSection.innerHTML = '<div class="container"><h2 class="block-title">Product Solution Offerings</h2><div class="accordion-wrapper"><div class="left-accordion-wrapper"></div><div class="right-accordion-wrapper"></div></div></div>';
document.querySelector('.accordion-section .container .left-accordion-wrapper').innerHTML = accordionTabs;
document.querySelector('.accordion-section .container .right-accordion-wrapper').innerHTML = accordionContent;
document.querySelectorAll('.accordion')[0].classList.add('active');
document.querySelectorAll('.accordion-image')[0].classList.add('active');
const accordions = document.querySelectorAll('.accordion');
const images = document.querySelectorAll('.accordion-image');
document.querySelectorAll('.accordion').forEach((acc, index) => {
    acc.addEventListener('click', () => {
        accordions.forEach(a => a.classList.remove('active'));
        images.forEach(img => img.classList.remove('active'));
        images[index].classList.add('active');
        acc.classList.add('active');
    });
});

// Testimonials section
const testimonialSection = document.createElement('section');
testimonialSection.classList.add('testimonial-section');
document.querySelector('.accordion-section').after(testimonialSection);
testimonialSection.innerHTML = '<div class="container splide" id="splide"><div class="testimonial-wrapper swiper splide__track"><ul class="swiper-wrapper splide__list"></ul></div></div>';

let testimonialSlide = '';
testimonials.map((slide) => {

    // swiper js
    // testimonialSlide = testimonialSlide + `
    // <div class="testimonial-card swiper-slide splide__slide">
    //     <p class="testimonial-text">${slide.text}</p>
    //     <div class="testimonial-footer">
    //         <div class="author">
    //             <img src="${slide.authorImage}" alt="${slide.authorName}" />
    //             <div>
    //                 <strong>${slide.authorName}</strong>
    //                 <span>${slide.authorDesignation}</span>
    //             </div>
    //         </div>

    //         <div class="brand">
    //             <img src="${slide.brandLogo}" alt="${slide.authorName}" />
    //         </div>
    //     </div>
    // </div>`;

    // splide js
    testimonialSlide = testimonialSlide + `
    <li class="testimonial-card swiper-slide splide__slide">
        <p class="testimonial-text">${slide.text}</p>
        <div class="testimonial-footer">
            <div class="author">
                <div class="author-image">
                    <img src="${slide.authorImage}" alt="${slide.authorName}" />
                </div>
                <div>
                    <strong>${slide.authorName}</strong>
                    <span>${slide.authorDesignation}</span>
                </div>
            </div>

            <div class="brand">
                <img src="${slide.brandLogo}" alt="${slide.authorName}" />
            </div>
        </div>
    </li>`;
});

document.querySelector('.testimonial-section .container .testimonial-wrapper .swiper-wrapper').innerHTML = testimonialSlide;

// only for swiper
// document.querySelector('.testimonial-section .container .testimonial-wrapper').insertAdjacentHTML('afterbegin', '<button class="swiper-button-prev"></button>')
// document.querySelector('.testimonial-section .container .testimonial-wrapper').insertAdjacentHTML('beforeend', '<button class="swiper-button-next"></button>')

// async function initSwiper() {
//     await loadStyle('https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css');
//     await loadScript('https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js');

//     await waitForElement('.testimonial-wrapper')

//     console.log(document.querySelector('.testimonial-wrapper'));
//     const swiper = new Swiper('.testimonial-wrapper', {
//         slidesPerView: 1,
//         spaceBetween: 10,
//         loop: true,
//         // pagination: {
//         //     el: '.swiper-pagination',
//         //     clickable: true,
//         // },
//         navigation: {
//             nextEl: '.swiper-button-next',
//             prevEl: '.swiper-button-prev',
//         },
//     });

//     console.log('✅ Swiper initialized', swiper);
// }
// initSwiper();

async function initSplide() {
    await loadStyle('https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js');

    await waitForElement('#splide');

    new Splide('#splide', {
        type: 'loop',
        perPage: 1,
        autoplay: true,
        pauseOnHover: true,
        pagination: false
    }).mount();
}
initSplide();

// Industries section
const industriesSection = document.createElement('section');
industriesSection.classList.add('industries');
document.querySelector('.testimonial-section').after(industriesSection);
industriesSection.innerHTML = `<div class="container"><h2 class="industries-title">Industries</h2><div class="industries-tabs desktop"></div><div class="industries-tabs tablet"></div><div class="swiper"><div class="industries-content swiper-wrapper"></div><div class="swiper-pagination"></div></div></div>`;

let industriesTabDesktop = '';
let industriesTabTablet = '';
let industriesContent = '';
industries.map((tab, index) => {
    industriesTabDesktop = industriesTabDesktop + `
        <button class="tab ${index == 0 ? 'active' : ''}">${tab.title}</button>
        `;
    industriesTabTablet = industriesTabTablet + `
        <button class="tab ${index == 0 ? 'active' : ''}">${index + 1}</button>
    `

    industriesContent = industriesContent + `
        <div class="industries-content-wrapper swiper-slide">
            <div class="left-content-wrapper">
                <h3>${tab.title}</h3>

                <p>${tab.text1}</p>

                <p>${tab.text2}</p>

                ${tab.text3 ? `<p>${tab.text3}</p>` : ''}

                <button class="btn-primary">Get a Demo</button>
            </div>
            <div class="right-content-wrapper">
                <div class="image-wrapper"><img src="${tab.image}" alt="${tab.title}" /></div>
            </div>
        </div>
    `;
});

document.querySelector('.industries .industries-tabs.desktop').innerHTML = industriesTabDesktop;
document.querySelector('.industries .industries-tabs.tablet').innerHTML = industriesTabTablet;
document.querySelector('.industries .industries-content').innerHTML = industriesContent;

async function initSwiper() {
    await loadStyle('https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js');

    await waitForElement('.industries .swiper');
    await waitForElement('.swiper-pagination');
    await waitForElement('.industries-tabs button');

    const swiper = new Swiper('.industries .swiper', {
        slidesPerView: 1,
        speed: 600,
        autoHeight: true,
        // autoplay: {
        //     delay: 5000,
        //     disableOnInteraction: false,
        // },
    });

    console.log(swiper)

    const tabsDesktop = document.querySelectorAll('.industries-tabs.desktop button');
    const tabsTablet = document.querySelectorAll('.industries-tabs.tablet button');

    tabsDesktop.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            swiper.slideTo(index);
        });
    });
    tabsTablet.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            swiper.slideTo(index);
        });
    });

    swiper.on('slideChange', () => {
        tabsDesktop.forEach(t => t.classList.remove('active'));
        tabsDesktop[swiper.activeIndex]?.classList.add('active');
        tabsTablet.forEach(t => t.classList.remove('active'));
        tabsTablet[swiper.activeIndex]?.classList.add('active');
    });

    console.log('✅ Industries Swiper initialized', swiper);
}
initSwiper();

// CONTACT US SECTION
const contactUsSection = `
    <section class="contact-us-section">
        <div class="container">
        <div class="content-wrapper">
            <div class="image-wrapper">
                <img src="https://res.cloudinary.com/dcsohyepb/image/upload/v1766592830/Frame_1000003756-1_cmfw82.png" alt="chain" />
            </div>
            <h2>Accelerate Your Network<br />Transformation Today</h2>
            <button class="btn-primary">Contact Us</button>
        </div>
        </div>
    </section>
`
document.querySelector('.industries').insertAdjacentHTML('afterend', contactUsSection);

// ABOUT US SECTION
const aboutUsSection = `
    <section class="about-us-section">
        <div class="container">
            <div class="content-wrapper">
                <div class="left-content-wrapper">
                    <h3>You Know Us!</h3>

                    <p>Our heritage precedes us, but it does not define us. We leverage our experience to develop more reliable network solutions, as we continually innovate.</p>

                    <p>The Ribbon family has grown over the years, bringing together the best talent in our industry.  Our team’s innovative drive and deep engagement are vital to your success -- and ours.</p>

                    <button class="btn-primary">Learn About Ribbon</button>
                </div>
                <div class="right-content-wrapper">
                    <div class="image-wrapper">
                        <img src="https://res.cloudinary.com/dcsohyepb/image/upload/v1766592854/Video_thumb_tablet_qlxnf6.png" alt="brand logos" />
                    </div>
                </div>
            </div>
        </div>
    </section>
`
document.querySelector('.contact-us-section').insertAdjacentHTML('afterend', aboutUsSection);
