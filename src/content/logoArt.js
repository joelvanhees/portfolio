/*
 * Liquid glass artwork, taken verbatim from the supplied logo files.
 *
 * Two changes only, both required to place them in a page rather than on
 * their own document: the full-bleed background rect is dropped so the mark
 * sits on whatever is behind it, and every id is namespaced. All four files
 * reuse the same id names, so two marks on one page — the nav lockup and the
 * menu mark — would otherwise capture each other's gradients and filters.
 *
 * __ID__ is replaced at render time with a per-instance prefix.
 *
 * One further edit: the dark J drops its cast shadow and the soft halo behind
 * it, so the mark reads as the letter alone on the menu panel.
 */

export const LOGO_VIEWBOX = {"markDark": "0 0 512 512", "markLight": "0 0 512 512", "lockupDark": "0 0 960 470", "lockupLight": "0 0 960 470"};


export const LOGO_ART = {
  markDark: `<defs>
        <linearGradient id="__ID__body" x1="-20%" y1="0%" x2="112%" y2="100%"><stop offset="0" stop-color="#fff" stop-opacity=".97"/><stop offset=".15" stop-color="#fff" stop-opacity=".10"/><stop offset=".36" stop-color="#89918d" stop-opacity=".46"/><stop offset=".57" stop-color="#fff" stop-opacity=".88"/><stop offset=".76" stop-color="#66706b" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity=".93"/><animate attributeName="x1" values="-20%;18%;-20%" dur="8s" repeatCount="indefinite"/><animate attributeName="x2" values="112%;78%;112%" dur="8s" repeatCount="indefinite"/></linearGradient>
        <linearGradient id="__ID__rim" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0" stop-color="#fff" stop-opacity=".76"/><stop offset=".24" stop-color="#535b57" stop-opacity=".20"/><stop offset=".52" stop-color="#fff" stop-opacity=".56"/><stop offset=".74" stop-color="#2b312e" stop-opacity=".40"/><stop offset="1" stop-color="#fff" stop-opacity=".82"/></linearGradient>
        <linearGradient id="__ID__core" x1="0%" y1="0%" x2="100%" y2="85%"><stop offset="0" stop-color="#020303" stop-opacity=".70"/><stop offset=".31" stop-color="#fff" stop-opacity=".04"/><stop offset=".65" stop-color="#e4e9e6" stop-opacity=".42"/><stop offset="1" stop-color="#010202" stop-opacity=".72"/></linearGradient>
        <linearGradient id="__ID__shine" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0" stop-color="#fff" stop-opacity=".02"/><stop offset=".42" stop-color="#fff"/><stop offset=".56" stop-color="#fff" stop-opacity=".32"/><stop offset="1" stop-color="#fff" stop-opacity=".01"/><animate attributeName="x1" values="-80%;75%;-80%" dur="5.8s" repeatCount="indefinite"/><animate attributeName="x2" values="5%;160%;5%" dur="5.8s" repeatCount="indefinite"/></linearGradient>
        <filter id="__ID__shadow" x="-100" y="-100" width="500" height="520" filterUnits="userSpaceOnUse"><feGaussianBlur in="SourceAlpha" stdDeviation="15" result="b"/><feOffset in="b" dy="15" result="o"/><feFlood flood-color="#000" flood-opacity=".98" result="c"/><feComposite in="c" in2="o" operator="in"/></filter>
        <filter id="__ID__morph" x="-100" y="-100" width="500" height="520" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".010 .019" numOctaves="2" seed="31" result="n"><animate attributeName="baseFrequency" values=".010 .019;.015 .011;.008 .022;.010 .019" dur="8.4s" repeatCount="indefinite"/></feTurbulence><feGaussianBlur in="n" stdDeviation=".65" result="sn"/><feDisplacementMap in="SourceGraphic" in2="sn" scale="9" xChannelSelector="R" yChannelSelector="G" result="w"><animate attributeName="scale" values="8;15;10;8" dur="6.8s" repeatCount="indefinite"/></feDisplacementMap><feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="a"/><feSpecularLighting in="a" surfaceScale="7" specularConstant="1.5" specularExponent="38" lighting-color="#fff" result="sp"><fePointLight x="35" y="10" z="125"><animate attributeName="x" values="35;270;145;35" dur="7.8s" repeatCount="indefinite"/><animate attributeName="y" values="10;230;45;10" dur="7.8s" repeatCount="indefinite"/></fePointLight></feSpecularLighting><feComposite in="sp" in2="w" operator="in" result="cut"/><feBlend in="w" in2="cut" mode="screen"/></filter>
        <filter id="__ID__glow" x="-100" y="-100" width="500" height="520" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="7"/></filter>
        <path id="__ID__hook" d="M205 78C199 128 200 184 205 226C210 267 185 291 150 289C119 287 101 273 91 252" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path id="__ID__star" d="M205 3v58M176 34h58M184 13l42 42M226 13l-42 42" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path id="__ID__highlight" d="M194 77C189 123 190 168 194 209C198 248 183 268 160 271" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </defs>
            <g transform="translate(45 45) scale(1.27)">
        <use href="#__ID__star" stroke="#000" stroke-width="29" opacity=".95"/><use href="#__ID__star" stroke="url(#__ID__rim)" stroke-width="24" opacity=".84"/><use href="#__ID__star" stroke="url(#__ID__body)" stroke-width="19" filter="url(#__ID__morph)"/><use href="#__ID__star" stroke="#fff" stroke-width="2.2" opacity=".82"/>
        <use href="#__ID__hook" stroke="#fff" stroke-width="88" opacity=".18" filter="url(#__ID__glow)"/><use href="#__ID__hook" stroke="url(#__ID__rim)" stroke-width="83" opacity=".82"/><use href="#__ID__hook" stroke="#090b0a" stroke-width="77" opacity=".94"/><use href="#__ID__hook" stroke="url(#__ID__body)" stroke-width="71" opacity=".90" filter="url(#__ID__morph)"><animate attributeName="opacity" values=".80;.98;.86;.80" dur="6.2s" repeatCount="indefinite"/></use><use href="#__ID__hook" stroke="url(#__ID__core)" stroke-width="49" opacity=".76"/><use href="#__ID__hook" stroke="#fff" stroke-width="11" opacity=".15"/><use href="#__ID__hook" stroke="#fff" stroke-width="2.6" opacity=".84"/>
        <use href="#__ID__highlight" stroke="url(#__ID__shine)" stroke-width="10" stroke-dasharray="48 76"><animate attributeName="stroke-dashoffset" values="0;-248" dur="5.2s" repeatCount="indefinite"/></use><use href="#__ID__star" stroke="url(#__ID__shine)" stroke-width="5" stroke-dasharray="24 42"><animate attributeName="stroke-dashoffset" values="0;-132" dur="4.4s" repeatCount="indefinite"/></use>
      </g>`,
  markLight: `<defs>
        <linearGradient id="__ID__body" x1="-20%" y1="0%" x2="112%" y2="100%"><stop offset="0" stop-color="#fff" stop-opacity=".99"/><stop offset=".17" stop-color="#e9ecea" stop-opacity=".74"/><stop offset=".38" stop-color="#abb2ae" stop-opacity=".47"/><stop offset=".58" stop-color="#fff" stop-opacity=".96"/><stop offset=".76" stop-color="#c5cac7" stop-opacity=".60"/><stop offset="1" stop-color="#fff" stop-opacity=".99"/><animate attributeName="x1" values="-20%;18%;-20%" dur="8s" repeatCount="indefinite"/><animate attributeName="x2" values="112%;78%;112%" dur="8s" repeatCount="indefinite"/></linearGradient>
        <linearGradient id="__ID__core" x1="0%" y1="0%" x2="100%" y2="85%"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".31" stop-color="#b3bab6" stop-opacity=".32"/><stop offset=".59" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#8c9490" stop-opacity=".34"/></linearGradient>
        <linearGradient id="__ID__shine" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0" stop-color="#fff" stop-opacity=".06"/><stop offset=".4" stop-color="#fff"/><stop offset=".55" stop-color="#fff" stop-opacity=".42"/><stop offset="1" stop-color="#fff" stop-opacity=".04"/><animate attributeName="x1" values="-80%;75%;-80%" dur="5.8s" repeatCount="indefinite"/><animate attributeName="x2" values="5%;160%;5%" dur="5.8s" repeatCount="indefinite"/></linearGradient>
        <filter id="__ID__shadow" x="-100" y="-100" width="500" height="520" filterUnits="userSpaceOnUse"><feGaussianBlur in="SourceAlpha" stdDeviation="14" result="b"/><feOffset in="b" dy="15" result="o"/><feFlood flood-color="#111514" flood-opacity=".30" result="c"/><feComposite in="c" in2="o" operator="in"/></filter>
        <filter id="__ID__morph" x="-100" y="-100" width="500" height="520" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".010 .019" numOctaves="2" seed="31" result="n"><animate attributeName="baseFrequency" values=".010 .019;.015 .011;.008 .022;.010 .019" dur="8.4s" repeatCount="indefinite"/></feTurbulence><feGaussianBlur in="n" stdDeviation=".65" result="sn"/><feDisplacementMap in="SourceGraphic" in2="sn" scale="8" xChannelSelector="R" yChannelSelector="G" result="w"><animate attributeName="scale" values="7;14;9;7" dur="6.8s" repeatCount="indefinite"/></feDisplacementMap><feGaussianBlur in="SourceAlpha" stdDeviation="1.35" result="a"/><feSpecularLighting in="a" surfaceScale="5" specularConstant="1.14" specularExponent="31" lighting-color="#fff" result="sp"><fePointLight x="35" y="10" z="125"><animate attributeName="x" values="35;270;145;35" dur="7.8s" repeatCount="indefinite"/><animate attributeName="y" values="10;230;45;10" dur="7.8s" repeatCount="indefinite"/></fePointLight></feSpecularLighting><feComposite in="sp" in2="w" operator="in" result="cut"/><feBlend in="w" in2="cut" mode="screen"/></filter>
        <filter id="__ID__glow" x="-100" y="-100" width="500" height="520" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="7"/></filter>
        <path id="__ID__hook" d="M205 78C199 128 200 184 205 226C210 267 185 291 150 289C119 287 101 273 91 252" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path id="__ID__star" d="M205 3v58M176 34h58M184 13l42 42M226 13l-42 42" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path id="__ID__highlight" d="M194 77C189 123 190 168 194 209C198 248 183 268 160 271" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </defs>
      <g transform="translate(45 45) scale(1.27)">
        <use href="#__ID__star" stroke="#303532" stroke-width="29" opacity=".30"/><use href="#__ID__star" stroke="#747c78" stroke-width="24" opacity=".37"/><use href="#__ID__star" stroke="url(#__ID__body)" stroke-width="19" filter="url(#__ID__morph)"/><use href="#__ID__star" stroke="#fff" stroke-width="2"/>
        <use href="#__ID__hook" stroke="#252a28" stroke-width="92" opacity=".23" filter="url(#__ID__shadow)"/><use href="#__ID__hook" stroke="#fff" stroke-width="84" filter="url(#__ID__glow)"/><use href="#__ID__hook" stroke="#6e7672" stroke-width="80" opacity=".33"/><use href="#__ID__hook" stroke="url(#__ID__body)" stroke-width="72" opacity=".94" filter="url(#__ID__morph)"><animate attributeName="opacity" values=".90;.99;.92;.90" dur="6.2s" repeatCount="indefinite"/></use><use href="#__ID__hook" stroke="url(#__ID__core)" stroke-width="48" opacity=".75"/><use href="#__ID__hook" stroke="#59615d" stroke-width="2.2" opacity=".44"/>
        <use href="#__ID__highlight" stroke="url(#__ID__shine)" stroke-width="9" stroke-dasharray="48 76"><animate attributeName="stroke-dashoffset" values="0;-248" dur="5.2s" repeatCount="indefinite"/></use><use href="#__ID__star" stroke="url(#__ID__shine)" stroke-width="5" stroke-dasharray="24 42"><animate attributeName="stroke-dashoffset" values="0;-132" dur="4.4s" repeatCount="indefinite"/></use>
      </g>`,
  lockupDark: `<defs>
        <linearGradient id="__ID__body" x1="-20%" y1="0%" x2="112%" y2="100%">
          <stop offset="0" stop-color="#fff" stop-opacity=".97"/><stop offset=".15" stop-color="#fff" stop-opacity=".10"/>
          <stop offset=".36" stop-color="#89918d" stop-opacity=".46"/><stop offset=".57" stop-color="#fff" stop-opacity=".88"/>
          <stop offset=".76" stop-color="#66706b" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity=".93"/>
          <animate attributeName="x1" values="-20%;18%;-20%" dur="8s" repeatCount="indefinite"/>
          <animate attributeName="x2" values="112%;78%;112%" dur="8s" repeatCount="indefinite"/>
        </linearGradient>
        <linearGradient id="__ID__rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0" stop-color="#fff" stop-opacity=".76"/><stop offset=".24" stop-color="#535b57" stop-opacity=".20"/>
          <stop offset=".52" stop-color="#fff" stop-opacity=".56"/><stop offset=".74" stop-color="#2b312e" stop-opacity=".40"/>
          <stop offset="1" stop-color="#fff" stop-opacity=".82"/>
        </linearGradient>
        <linearGradient id="__ID__core" x1="0%" y1="0%" x2="100%" y2="82%">
          <stop offset="0" stop-color="#020303" stop-opacity=".70"/><stop offset=".31" stop-color="#fff" stop-opacity=".04"/>
          <stop offset=".65" stop-color="#e4e9e6" stop-opacity=".42"/><stop offset="1" stop-color="#010202" stop-opacity=".72"/>
        </linearGradient>
        <linearGradient id="__ID__shine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0" stop-color="#fff" stop-opacity=".02"/><stop offset=".42" stop-color="#fff" stop-opacity="1"/>
          <stop offset=".56" stop-color="#fff" stop-opacity=".32"/><stop offset="1" stop-color="#fff" stop-opacity=".01"/>
          <animate attributeName="x1" values="-80%;75%;-80%" dur="6s" repeatCount="indefinite"/>
          <animate attributeName="x2" values="5%;160%;5%" dur="6s" repeatCount="indefinite"/>
        </linearGradient>
        <filter id="__ID__shadow" x="-120" y="-120" width="1120" height="650" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="18" result="blur"/><feOffset in="blur" dy="18" result="offset"/>
          <feFlood flood-color="#000" flood-opacity=".98" result="color"/><feComposite in="color" in2="offset" operator="in"/>
        </filter>
        <filter id="__ID__morph" x="-120" y="-120" width="1120" height="650" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency=".009 .018" numOctaves="2" seed="27" result="noise">
            <animate attributeName="baseFrequency" values=".009 .018;.014 .011;.007 .021;.009 .018" dur="9s" repeatCount="indefinite"/>
          </feTurbulence>
          <feGaussianBlur in="noise" stdDeviation=".7" result="soft"/>
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="9" xChannelSelector="R" yChannelSelector="G" result="warped">
            <animate attributeName="scale" values="8;15;10;8" dur="7.2s" repeatCount="indefinite"/>
          </feDisplacementMap>
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="alpha"/>
          <feSpecularLighting in="alpha" surfaceScale="7" specularConstant="1.5" specularExponent="38" lighting-color="#fff" result="spec">
            <fePointLight x="80" y="10" z="145"><animate attributeName="x" values="80;780;420;80" dur="8.4s" repeatCount="indefinite"/><animate attributeName="y" values="10;240;40;10" dur="8.4s" repeatCount="indefinite"/></fePointLight>
          </feSpecularLighting>
          <feComposite in="spec" in2="warped" operator="in" result="cut"/><feBlend in="warped" in2="cut" mode="screen"/>
        </filter>
        <filter id="__ID__glow" x="-120" y="-120" width="1120" height="650" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="7"/></filter>
        <g id="__ID__word" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M205 78C199 128 200 184 205 226C210 267 185 291 150 289C119 287 101 273 91 252"/>
          <path d="M247 186C236 132 277 96 330 101C384 106 405 158 383 202C361 246 292 255 259 214C230 178 253 137 302 133C351 129 391 154 420 184"/>
          <path d="M423 185C441 143 508 131 541 160C573 188 541 212 463 202C470 248 538 266 585 218C602 201 612 183 619 164"/>
          <path d="M656 85C643 60 655 37 679 42C704 48 699 75 690 99C673 146 670 193 677 228C685 267 721 280 760 250"/>
        </g>
        <path id="__ID__star" d="M205 3v58M176 34h58M184 13l42 42M226 13l-42 42" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <g id="__ID__highlights" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M194 77C189 123 190 168 194 209"/><path d="M258 177C258 139 286 117 325 117C356 117 378 136 378 163"/><path d="M438 177C459 151 506 148 532 166"/><path d="M666 83C660 67 666 56 678 55"/></g>
        <g id="__ID__descriptor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M0 0l11 30L22 0M34 30L45 0l11 30M38 20h14M68 30V0l22 30V0"/><path d="M125 0v30M147 0v30M125 15h22M161 0h22M161 15h18M161 30h22M197 0h22M197 15h18M197 30h22M252 3c-5-4-18-5-21 3-4 11 23 6 22 17-1 9-17 10-24 3"/></g>
      </defs>
      <ellipse cx="480" cy="225" rx="350" ry="150" fill="#d9dedc" opacity=".065" filter="url(#__ID__glow)"/>
      <g transform="translate(60 40)">
        <use href="#__ID__star" stroke="#000" stroke-width="29" opacity=".95"/><use href="#__ID__star" stroke="url(#__ID__rim)" stroke-width="24" opacity=".84"/><use href="#__ID__star" stroke="url(#__ID__body)" stroke-width="19" filter="url(#__ID__morph)"/><use href="#__ID__star" stroke="#fff" stroke-width="2.2" opacity=".82"/>
        <use href="#__ID__word" stroke="#000" stroke-width="94" filter="url(#__ID__shadow)"/><use href="#__ID__word" stroke="#fff" stroke-width="88" opacity=".17" filter="url(#__ID__glow)"/>
        <use href="#__ID__word" stroke="url(#__ID__rim)" stroke-width="83" opacity=".80"/><use href="#__ID__word" stroke="#090b0a" stroke-width="77" opacity=".94"/>
        <use href="#__ID__word" stroke="url(#__ID__body)" stroke-width="71" opacity=".90" filter="url(#__ID__morph)"><animate attributeName="opacity" values=".80;.98;.86;.80" dur="6.8s" repeatCount="indefinite"/></use>
        <use href="#__ID__word" stroke="url(#__ID__core)" stroke-width="49" opacity=".75"/><use href="#__ID__word" stroke="#fff" stroke-width="11" opacity=".14"/><use href="#__ID__word" stroke="#fff" stroke-width="2.6" opacity=".82"/>
        <use href="#__ID__highlights" stroke="url(#__ID__shine)" stroke-width="10" stroke-dasharray="48 76" opacity=".96"><animate attributeName="stroke-dashoffset" values="0;-248" dur="5.5s" repeatCount="indefinite"/></use>
        <use href="#__ID__star" stroke="url(#__ID__shine)" stroke-width="5" stroke-dasharray="24 42"><animate attributeName="stroke-dashoffset" values="0;-132" dur="4.5s" repeatCount="indefinite"/></use>
        <ellipse cx="526" cy="178" rx="14.5" ry="9.5" transform="rotate(-8 526 178)" fill="#050505"/><ellipse cx="526" cy="178" rx="14.5" ry="9.5" transform="rotate(-8 526 178)" fill="none" stroke="#eef1ef" stroke-opacity=".66" stroke-width="2.6"/>
      </g>
      <g transform="translate(372 385)"><use href="#__ID__descriptor" stroke="#000" stroke-width="10"/><use href="#__ID__descriptor" stroke="url(#__ID__rim)" stroke-width="7"/><use href="#__ID__descriptor" stroke="url(#__ID__body)" stroke-width="4.8"/><use href="#__ID__descriptor" stroke="#fff" stroke-width="1.2" opacity=".82"/></g>`,
  lockupLight: `<defs>
        <linearGradient id="__ID__body" x1="-20%" y1="0%" x2="112%" y2="100%"><stop offset="0" stop-color="#fff" stop-opacity=".99"/><stop offset=".17" stop-color="#e9ecea" stop-opacity=".74"/><stop offset=".38" stop-color="#adb4b1" stop-opacity=".47"/><stop offset=".57" stop-color="#fff" stop-opacity=".96"/><stop offset=".76" stop-color="#c6cbc8" stop-opacity=".60"/><stop offset="1" stop-color="#fff" stop-opacity=".99"/><animate attributeName="x1" values="-20%;18%;-20%" dur="8s" repeatCount="indefinite"/><animate attributeName="x2" values="112%;78%;112%" dur="8s" repeatCount="indefinite"/></linearGradient>
        <linearGradient id="__ID__core" x1="0%" y1="0%" x2="100%" y2="82%"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".31" stop-color="#b4bbb7" stop-opacity=".32"/><stop offset=".59" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#8d9591" stop-opacity=".34"/></linearGradient>
        <linearGradient id="__ID__shine" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0" stop-color="#fff" stop-opacity=".06"/><stop offset=".4" stop-color="#fff"/><stop offset=".55" stop-color="#fff" stop-opacity=".42"/><stop offset="1" stop-color="#fff" stop-opacity=".04"/><animate attributeName="x1" values="-80%;75%;-80%" dur="6.4s" repeatCount="indefinite"/><animate attributeName="x2" values="5%;160%;5%" dur="6.4s" repeatCount="indefinite"/></linearGradient>
        <filter id="__ID__shadow" x="-120" y="-120" width="1120" height="650" filterUnits="userSpaceOnUse"><feGaussianBlur in="SourceAlpha" stdDeviation="15" result="b"/><feOffset in="b" dy="17" result="o"/><feFlood flood-color="#111514" flood-opacity=".28" result="c"/><feComposite in="c" in2="o" operator="in"/></filter>
        <filter id="__ID__morph" x="-120" y="-120" width="1120" height="650" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".009 .018" numOctaves="2" seed="27" result="n"><animate attributeName="baseFrequency" values=".009 .018;.014 .011;.007 .021;.009 .018" dur="9s" repeatCount="indefinite"/></feTurbulence><feGaussianBlur in="n" stdDeviation=".7" result="sn"/><feDisplacementMap in="SourceGraphic" in2="sn" scale="8" xChannelSelector="R" yChannelSelector="G" result="w"><animate attributeName="scale" values="7;13;9;7" dur="7.2s" repeatCount="indefinite"/></feDisplacementMap><feGaussianBlur in="SourceAlpha" stdDeviation="1.4" result="a"/><feSpecularLighting in="a" surfaceScale="5" specularConstant="1.14" specularExponent="31" lighting-color="#fff" result="sp"><fePointLight x="80" y="10" z="150"><animate attributeName="x" values="80;780;420;80" dur="8.6s" repeatCount="indefinite"/><animate attributeName="y" values="10;240;40;10" dur="8.6s" repeatCount="indefinite"/></fePointLight></feSpecularLighting><feComposite in="sp" in2="w" operator="in" result="cut"/><feBlend in="w" in2="cut" mode="screen"/></filter>
        <filter id="__ID__glow" x="-120" y="-120" width="1120" height="650" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="7"/></filter>
        <g id="__ID__word" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M205 78C199 128 200 184 205 226C210 267 185 291 150 289C119 287 101 273 91 252"/><path d="M247 186C236 132 277 96 330 101C384 106 405 158 383 202C361 246 292 255 259 214C230 178 253 137 302 133C351 129 391 154 420 184"/><path d="M423 185C441 143 508 131 541 160C573 188 541 212 463 202C470 248 538 266 585 218C602 201 612 183 619 164"/><path d="M656 85C643 60 655 37 679 42C704 48 699 75 690 99C673 146 670 193 677 228C685 267 721 280 760 250"/></g>
        <path id="__ID__star" d="M205 3v58M176 34h58M184 13l42 42M226 13l-42 42" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <g id="__ID__highlights" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M194 77C189 123 190 168 194 209"/><path d="M258 177C258 139 286 117 325 117C356 117 378 136 378 163"/><path d="M438 177C459 151 506 148 532 166"/><path d="M666 83C660 67 666 56 678 55"/></g>
        <g id="__ID__descriptor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M0 0l11 30L22 0M34 30L45 0l11 30M38 20h14M68 30V0l22 30V0"/><path d="M125 0v30M147 0v30M125 15h22M161 0h22M161 15h18M161 30h22M197 0h22M197 15h18M197 30h22M252 3c-5-4-18-5-21 3-4 11 23 6 22 17-1 9-17 10-24 3"/></g>
      </defs>
      <g transform="translate(60 40)">
        <use href="#__ID__star" stroke="#303532" stroke-width="29" opacity=".30"/><use href="#__ID__star" stroke="#747c78" stroke-width="24" opacity=".37"/><use href="#__ID__star" stroke="url(#__ID__body)" stroke-width="19" filter="url(#__ID__morph)"/><use href="#__ID__star" stroke="#fff" stroke-width="2"/>
        <use href="#__ID__word" stroke="#252a28" stroke-width="92" opacity=".23" filter="url(#__ID__shadow)"/><use href="#__ID__word" stroke="#fff" stroke-width="84" filter="url(#__ID__glow)"/><use href="#__ID__word" stroke="#6f7773" stroke-width="80" opacity=".33"/><use href="#__ID__word" stroke="url(#__ID__body)" stroke-width="72" opacity=".94" filter="url(#__ID__morph)"><animate attributeName="opacity" values=".90;.99;.92;.90" dur="6.8s" repeatCount="indefinite"/></use><use href="#__ID__word" stroke="url(#__ID__core)" stroke-width="48" opacity=".75"/><use href="#__ID__word" stroke="#5d6561" stroke-width="2.2" opacity=".44"/>
        <use href="#__ID__highlights" stroke="url(#__ID__shine)" stroke-width="9" stroke-dasharray="48 76"><animate attributeName="stroke-dashoffset" values="0;-248" dur="5.8s" repeatCount="indefinite"/></use><use href="#__ID__star" stroke="url(#__ID__shine)" stroke-width="5" stroke-dasharray="24 42"><animate attributeName="stroke-dashoffset" values="0;-132" dur="4.8s" repeatCount="indefinite"/></use>
        <ellipse cx="526" cy="178" rx="14.5" ry="9.5" transform="rotate(-8 526 178)" fill="#fff"/><ellipse cx="526" cy="178" rx="14.5" ry="9.5" transform="rotate(-8 526 178)" fill="none" stroke="#737b77" stroke-opacity=".55" stroke-width="2.4"/>
      </g>
      <g transform="translate(372 385)"><use href="#__ID__descriptor" stroke="#fff" stroke-width="9"/><use href="#__ID__descriptor" stroke="#646b68" stroke-width="6.2" opacity=".52"/><use href="#__ID__descriptor" stroke="url(#__ID__body)" stroke-width="4.8"/><use href="#__ID__descriptor" stroke="#252a28" stroke-width="1" opacity=".58"/></g>`,
};
