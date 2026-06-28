import { createContext, useContext, useEffect, useState } from "react";
import ThreeCanvas from "./components/ThreeCanvas";
import PosonCardShare from "./components/PosonCard";

// ─── Language Types & Translations ───────────────────────────────────────────
export type Lang = "en" | "si";

const translations = {
  en: {
    // Nav
    navBrand: "Poson Poya",
    navAbout: "About",
    navSignificance: "Significance",
    navObserve: "Observe",
    navShareCard: "Share Card",
    navShareCardFull: "Share a Poson Card",

    // Hero
    heroTitle: "May You Be Blessed This Poson Poya!",
    heroSubtitle: "Poson Poya Day! Keep it glowing 🙏",
    heroScrollHint: "Scroll Down",

    // About section
    aboutLabel: "Sacred History",
    aboutTitle: "The Arrival of the Dhamma",
    aboutP1: (
      <>
        <strong>Poson</strong>, also known as <strong>Poson Poya</strong>, is an
        annual festival held by Sri Lankan Buddhists celebrating the arrival of
        Buddhism in Sri Lanka in the 3rd century BC. The festival is the most
        important Poya (full moon) holiday of the year and the second most
        important Buddhist holiday of the year, being surpassed in importance
        only by Vesak. Poson is celebrated throughout the island, with the most
        important ceremonies of the festival being held in{" "}
        <strong style={{ color: "#f5c26b" }}>Anuradhapura</strong> and{" "}
        <strong style={{ color: "#f5c26b" }}>Mihintale</strong>. The festival is
        held in early June, coinciding with the June full moon.
      </>
    ),
    aboutP2: (
      <>
        Poson is celebrated to commemorate the introduction of Buddhism to Sri
        Lanka by <strong>Mahinda Thero</strong> in 236 BC. The focal point of
        the religious festival is the Buddhist monastic complex on the mountain
        of <strong style={{ color: "#f5c26b" }}>Mihintale</strong>, where
        Arahath Mahinda Thero preached Buddhism to King Devanampiyatissa.
        Celebrations are also centered around Buddhist sites in Anuradhapura,
        which was one of the first cities in Sri Lanka to convert to Buddhism.
        During Poson, these locations attract thousands of pilgrims clad in
        white who worship at these spiritual locales and spend hours in quiet
        contemplation to honor the traditions of Buddhism.
      </>
    ),
    aboutP3: (
      <>
        The festival is celebrated island-wide, featuring huge electronically
        lit <strong>Pandols</strong> showcased in various city centres, and{" "}
        <strong>dansals</strong> (free food stalls organized by communities).
        Houses are decorated with lanterns and lights to commemorate the day in
        a festive manner. The celebrations continue for five days to a week
        starting from the full moon poya day. In respect of the spiritual nature
        of the festival, some parts of Sri Lanka prohibit the sale of meat and
        alcohol during this period.
      </>
    ),
    stat1Num: "236 BCE",
    stat1Label: "Year of Mahinda's arrival",
    stat2Num: "1818",
    stat2Label: "Steps to Mihintale summit",
    stat3Num: "2500+",
    stat3Label: "Years of Theravāda tradition",

    // Significance section
    sigLabel: "The Five Buddhist Flag Colors",
    sigTitle: "Symbols of the Poya",
    sig: [
      {
        color: "#1a4fd4",
        icon: "☸️",
        title: "Nīla — Blue",
        desc: "The compassionate, loving kindness in the Buddha's aura, representing the purity of the Dhamma.",
      },
      {
        color: "#e6b800",
        icon: "🌕",
        title: "Pīta — Gold",
        desc: "The middle path free of extremes — the golden hue of the full Poya moon blessing Sri Lanka.",
      },
      {
        color: "#e63c00",
        icon: "🔥",
        title: "Lohita — Red",
        desc: "The blessing of achievement, wisdom, virtue and fortune on the sacred Poson night.",
      },
      {
        color: "#d4849a",
        icon: "🪷",
        title: "Odāta — White",
        desc: "The purity of the Dhamma — devotees don white on Poya day in observance and reverence.",
      },
      {
        color: "#e87c2a",
        icon: "🏮",
        title: "Mañjeṭṭha — Saffron",
        desc: "The essence of these colors combined, representing the all-encompassing radiance of the Buddha.",
      },
    ],

    // Observe section
    obsLabel: "Sacred Observances",
    obsTitle: "How Poson is Observed",
    obs: [
      {
        time: "Dawn",
        act: "Sil Observance",
        desc: "Devotees take eight precepts (Attha Sila) at their local temple, dedicating the full moon day to meditation, chanting and Dhamma study.",
        color: "#8da1cd",
      },
      {
        time: "Day",
        act: "Dansal & Almsgiving",
        desc: "Temporary pavilions line streets across the country, offering free food, drinks and merit to all passersby — an act of collective dāna.",
        color: "#f5c26b",
      },
      {
        time: "Dusk",
        act: "Atapattam Lanterns",
        desc: "Families light and hang the iconic octagonal paper lanterns in Buddhist flag colors, their amber glow painting every street and garden.",
        color: "#c9923a",
      },
      {
        time: "Night",
        act: "Pilgrimage to Mihintale",
        desc: "Tens of thousands of white-clad pilgrims ascend the 1818 granite steps of Mihintale by moonlight, reenacting Mahinda's sacred descent.",
        color: "#d4849a",
      },
    ],
    obsShareTitle: "Spread the Dhamma 🪷",
    obsShareDesc:
      "Send a blessed Poson greeting card to your family and friends.",
    obsShareBtn: "Share a Card",

    // Footer
    footerRegion: "ශ්‍රී ලංකා · Sri Lanka",

    // Card modal translation strings
    cardTitle: "Poson Poya Greeting Card",
    cardLoading: "Loading cards…",
    cardStats:
      "{templates} images · {combinations} combinations · share the Dhamma's light",
    cardPlaceholder: "Your card will appear here",
    cardIndexInfo: "Card {index} · {label} · {combinations} combinations",
    cardGenerateBtn: "✨ Generate your Poson card",
    cardLoadingImages: "Loading images…",
    cardTryAgain: "Try again",
    cardDownloadBtn: "Download card",
    cardPreparing: "Preparing…",
    cardShareLabel: "Share card",
    cardShareImgBtn: "Share image",
    cardSharing: "Sharing…",
    cardCopyLinkBtn: "Copy link",
    cardCopiedBtn: "Copied!",
    cardTip:
      '💡 Use "Share image" to share directly, or copy the link to send it to anyone.',
    cardDownloadedSuccess: "Card downloaded successfully!",
    cardDownloadFailed: "Download failed. Please try again.",
    cardSharedSuccess: "Shared successfully!",
    cardShareSaved: "Image saved — share it from your files!",
    cardShareFailed: "Sharing failed. Try downloading instead.",
    cardCopiedSuccess: "Link copied to clipboard!",
    cardFooter: "Poson Poya · ශ්‍රී ලංකා · Sādhu Sādhu Sādhu 🙏",

    // Generation stage translation strings
    genSteps: [
      {
        icon: "☸️",
        headline: "Invoking the Dhamma…",
        sub: "Reaching into 2,500 years of sacred tradition",
      },
      {
        icon: "🎇",
        headline: "Gathering lotus light…",
        sub: "Selecting the blessing meant for you",
      },
      {
        icon: "🌕",
        headline: "Aligning with the Poya moon…",
        sub: "As Mahinda descended upon Mihintale",
      },
      {
        icon: "🏮",
        headline: "Lighting your lantern…",
        sub: "Atapattam colors warming the night sky",
      },
      {
        icon: "🙏",
        headline: "Your card is almost ready…",
        sub: "May this greeting carry merit to all who receive it",
      },
    ],

    cardMessages: [
      "May the light of the Dhamma guide your path.\n\n https://happy-poson.vercel.app/",
      "Wishing you peace, wisdom & compassion.\n\n https://happy-poson.vercel.app/",
      "Sādhu • Sādhu • Sādhu\n\n https://happy-poson.vercel.app/",
      "May merit flow to all beings.\n\n https://happy-poson.vercel.app/",
    ],
  },

  si: {
    // Nav
    navBrand: "පොසොන් පොහොය",
    navAbout: "ඉතිහාසය",
    navSignificance: "වැදගත්කම",
    navObserve: "පිළිවෙත්",
    navShareCard: "කාඩ්පතක් යවන්න",
    navShareCardFull: "පොසොන් ආශිර්වාද කාඩ්පතක් යවන්න",

    // Hero
    heroTitle: "පින්බර පොසොන් මංගල්‍යයක් වේවා!",
    heroSubtitle: "පොසොන් පොහොය දිනය! ආලෝකය රකිමු 🙏",
    heroScrollHint: "ඉතිහාසය බලන්න",

    // About section
    aboutLabel: "ශ්‍රී ලංකා ධර්ම ඉතිහාසය",
    aboutTitle: "ධර්මය ලංකාවට පැමිණීම",
    aboutP1: (
      <>
        <strong>පොසොන් පොහොය</strong> ලෙසද හැඳින්වෙන පොසොන් උත්සවය, ක්‍රි.පූ. 3
        වන සියවසේදී ශ්‍රී ලංකාවට බුදුදහම පැමිණීම නිමිත්තෙන් ශ්‍රී ලාංකික
        බෞද්ධයන් විසින් පවත්වනු ලබන වාර්ෂික උත්සවයකි. මෙම උත්සවය වෙසක් උත්සවයට
        පමණක් දෙවැනි වන, වසරේ වඩාත්ම වැදගත් පුන් පොහෝ දිනය වන අතර වසරේ දෙවන
        වැදගත්ම බෞද්ධ උත්සවය වේ. දිවයින පුරා පොසොන් උත්සවය සමරනු ලබන අතර, මෙහි
        වඩාත්ම වැදගත් ආගමික වතාවත්{" "}
        <strong style={{ color: "#f5c26b" }}>අනුරාධපුරය</strong> සහ{" "}
        <strong style={{ color: "#f5c26b" }}>මිහින්තලය</strong> කේන්ද්‍ර
        කරගනිමින් පැවැත්වේ. ජූනි මාසයේ පුන් පොහෝ දිනයට සමගාමීව ජූනි මස මුල්
        භාගයේදී මෙම උත්සවය පැවැත්වේ.
      </>
    ),
    aboutP2: (
      <>
        ක්‍රි.පූ. 236 දී <strong>මිහිඳු මහ රහතන් වහන්සේ</strong> විසින් ශ්‍රී
        ලංකාවට බුදුදහම හඳුන්වා දීම සිහිපත් කිරීම සඳහා පොසොන් උත්සවය සමරනු ලැබේ.
        මෙම ආගමික උත්සවයේ කේන්ද්‍රස්ථානය වන්නේ{" "}
        <strong style={{ color: "#f5c26b" }}>මිහින්තල</strong> කඳු මුදුනේ පිහිටි
        බෞද්ධ විහාර සංකීර්ණය වන අතර, එහිදී අරහත් මිහිඳු මහ රහතන් වහන්සේ ශ්‍රී
        ලංකාවේ එවකට රජ කළ දේවානම්පියතිස්ස රජතුමාට ධර්මය දේශනා කළහ. ශ්‍රී ලංකාවේ
        බුදුදහම වැළඳගත් මුල්ම නගරවලින් එකක් වන අනුරාධපුරයේ පිහිටි පූජනීය බෞද්ධ
        සිද්ධස්ථාන කේන්ද්‍ර කරගනිමින් ද සැමරුම් පැවැත්වේ. පොසොන් සමයේදී මෙම
        ස්ථාන ද්විත්වය වෙත ශ්‍රී ලංකාව පුරා වෙසෙන දහස් සංඛ්‍යාත වන්දනාකරුවෝ සුදු
        පැහැති වතින් සැරසී පැමිණ වන්දනාමාන කරන අතර බුදුදහමේ උතුම් ප්‍රතිපත්තිවලට
        ගරු කරමින් පැය ගණනාවක් නිහඬව භාවනාවෙහි නිරත වෙති.
      </>
    ),
    aboutP3: (
      <>
        පොසොන් උත්සවය දිවයින පුරා සමරනු ලබන අතර, විවිධ නගර මධ්‍යස්ථානවල විදුලි
        ආලෝකයෙන් විචිත්‍රවත් වූ දැවැන්ත <strong>තොරණ</strong> ප්‍රදර්ශනය කෙරේ.
        එමෙන්ම විවිධ ප්‍රජාවන් විසින් සංවිධානය කරනු ලබන <strong>දන්සැල්</strong>{" "}
        (නොමිලේ ආහාර පාන ලබා දෙන කුටි) ක්‍රියාත්මක වේ. උත්සව ශ්‍රීයෙන් දිනය
        සැමරීම සඳහා නිවාස පහන් සහ කූඩුවලින් අලංකාර කෙරේ. පුර පසළොස්වක පොහොය දින
        සිට දින 5ක් හෝ සතියක් පුරා මෙම සැමරුම් පැවැත්වේ. උත්සවය අතරතුර ශ්‍රී
        ලංකාවේ සමහර ප්‍රදේශවල මස් පිණිස සතුන් මැරීම, මස් විකිණීම සහ මත්පැන්
        අලෙවි කිරීම සපුරා තහනම් වේ.
      </>
    ),
    stat1Num: "ක්‍රි.පූ. 236",
    stat1Label: "මිහිඳු රහතන් ලංකාවට වැඩිය වර්ෂය",
    stat2Num: "1818",
    stat2Label: "මිහිඳු ගල මුදුනේ පියමං ගණන",
    stat3Num: "2500+",
    stat3Label: "ථේරවාද බෞද්ධ සම්ප්‍රදායේ වයස",

    // Significance section
    sigLabel: "බෞද්ධ කොඩියේ වර්ණ පහ",
    sigTitle: "පොහොයේ සංකේත",
    sig: [
      {
        color: "#1a4fd4",
        icon: "☸️",
        title: "නීල — නිල්",
        desc: "බුද්ධ රශ්මිය නියෝජනය කරන කරුණා, මෛත්‍රී, ධර්ම ශුද්ධතාවය.",
      },
      {
        color: "#e6b800",
        icon: "🌕",
        title: "පීත — රන්",
        desc: "ශ්‍රේෂ්ඨ මධ්‍යම ප්‍රතිපදාව — ශ්‍රී ලංකාව ආශිර්වාද කරන පොහොය සඳ රන් දීප්තිය.",
      },
      {
        color: "#e63c00",
        icon: "🔥",
        title: "ලෝහිත — රතු",
        desc: "ශ්‍රේෂ්ඨ පොසොන් රාත්‍රියේ ගුණ, ප්‍රඥා, ශ්‍රේෂ්ඨ ජය.",
      },
      {
        color: "#d4849a",
        icon: "🪷",
        title: "ඔදාත — සුදු",
        desc: "ධර්ම ශුද්ධතාවය — පොහොය දිනයේ දෙව් ජනයා සුදු ඇදුම් ඇඳ ගෙවීම් කරයි.",
      },
      {
        color: "#e87c2a",
        icon: "🏮",
        title: "මඤ්ජෙෂ්ඨ — කහ",
        desc: "ඉහත වර්ණ සියල්ලෙහි සාරය — බුදු රජාණන්ගේ සර්වබලගතු ශ්‍රේෂ්ඨ ආලෝකය.",
      },
    ],

    // Observe section
    obsLabel: "ශුද්ධ ආගමික ක්‍රියාමාර්ග",
    obsTitle: "පොසොන් ගෙවීම",
    obs: [
      {
        time: "උදෑසන",
        act: "සිල් ගෙවීම",
        desc: "දෙව් ජනයා ඔවුන්ගේ දේවාලයේ දී අෂ්ට සිල් ගෙන, සමාධිය, ගාථා කීම, ධර්ම අධ්‍යයනය සඳහා දවස කැප කරයි.",
        color: "#8da1cd",
      },
      {
        time: "දහවල්",
        act: "දාන සාල් හා ආහාර දීම",
        desc: "රටපුරා ජනතාවට නොමිලේ ආහාරපාන, ජලය, හා කුසල් ලබා දෙමින් ජනයා ගොනු කරන 'දාන' ශාලා පිහිටු වෙයි.",
        color: "#f5c26b",
      },
      {
        time: "සඳාව",
        act: "අෂ්ටාපතම් ලාම්පු",
        desc: "පවුල් බෞද්ධ කොඩි වර්ණ ලාම්පු දල්වා, ඒවා ඇසිරූ ලෙස රාත්‍රිය ආලෝකමත් කරයි.",
        color: "#c9923a",
      },
      {
        time: "රාත්‍රිය",
        act: "මිහිඳු ගල වැඳීම",
        desc: "දස දහස් ගණනක් සුදු ඇදුම් ගිය ජනතාව සඳ ආලෝකයෙන් මිහිඳු ගල නගා, රහතන් වහන්සේගේ ලංකාගමනය නැවත ස්ඵරණය කරති.",
        color: "#d4849a",
      },
    ],
    obsShareTitle: "ධර්මය බෙදා ගන්න 🪷",
    obsShareDesc: "ඔබේ පවුලට හා මිතුරන්ට ආශිර්වාද පොසොන් කාඩ්පතක් යවන්න.",
    obsShareBtn: "කාඩ්පතක් යවන්න",

    // Footer
    footerRegion: "ශ්‍රී ලංකා · Sri Lanka",

    // Card modal translation strings
    cardTitle: "පොසොන් ආශිර්වාද කාඩ්පත",
    cardLoading: "කාඩ්පත් පූරණය වෙමින් පවතී...",
    cardStats:
      "පින්තූර {templates} ක් · සංයෝජන {combinations} ක් · ශ්‍රී සද්ධර්මයේ ආලෝකය බෙදා හරින්න",
    cardPlaceholder: "ඔබේ ආශිර්වාද කාඩ්පත මෙහි දර්ශනය වනු ඇත",
    cardIndexInfo: "කාඩ්පත {index} · {label} · සංයෝජන {combinations} ක්",
    cardGenerateBtn: "✨ ඔබේ පොසොන් ආශිර්වාද කාඩ්පත සාදා ගන්න",
    cardLoadingImages: "පින්තූර පූරණය වෙමින්...",
    cardTryAgain: "නැවත උත්සාහ කරන්න",
    cardDownloadBtn: "කාඩ්පත බාගත කරන්න",
    cardPreparing: "සූදානම් වෙමින්...",
    cardShareLabel: "කාඩ්පත බෙදා ගන්න",
    cardShareImgBtn: "රූපය බෙදා ගන්න",
    cardSharing: "බෙදා ගනිමින්...",
    cardCopyLinkBtn: "කොපි කරන්න",
    cardCopiedBtn: "කොපි කෙරුණා!",
    cardTip:
      '💡 සෘජුවම බෙදා ගැනීමට "රූපය බෙදා ගන්න" ක්ලික් කරන්න, නැතහොත් ඕනෑම අයෙකුට යැවීමට ලින්ක් එක කොපි කරන්න.',
    cardDownloadedSuccess: "කාඩ්පත සාර්ථකව බාගත කරන ලදී!",
    cardDownloadFailed: "බාගත කිරීම අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න.",
    cardSharedSuccess: "සාර්ථකව බෙදා ගන්නා ලදී!",
    cardShareSaved: "රූපය සුරැකිණි — ඔබගේ ගොනු තුලින් එය බෙදා ගන්න!",
    cardShareFailed:
      "බෙදා ගැනීම අසාර්ථක විය. කරුණාකර බාගත කර ගැනීමට උත්සාහ කරන්න.",
    cardCopiedSuccess: "ලින්ක් එක සාර්ථකව කොපි කරන ලදී!",
    cardFooter: "පොසොන් පොහොය · ශ්‍රී ලංකා · සාදු සාදු සාදු 🙏",

    // Generation stage translation strings
    genSteps: [
      {
        icon: "☸️",
        headline: "ශ්‍රී සද්ධර්මය සිහිපත් කරමින්...",
        sub: "වසර 2,500ක උදාර ආගමික ඉතිහාසයකට ප්‍රවේශ වෙමින්",
      },
      {
        icon: "🎇",
        headline: "නෙළුම් මල් ආලෝකය එක් රැස් කරමින්...",
        sub: "ඔබ වෙනුවෙන්ම වෙන්වූ උතුම් ආශිර්වාදය තෝරා ගනිමින්",
      },
      {
        icon: "🌕",
        headline: "පොසොන් සඳෙහි ආලෝකය හා සමපාත වෙමින්...",
        sub: "මිහිඳු මහ රහතන් වහන්සේ මිහින්තලයට වැඩම කළ සේක",
      },
      {
        icon: "🏮",
        headline: "ඔබේ පොසොන් කූඩුව දල්වමින්...",
        sub: "අෂ්ටාපතම් වර්ණවලින් රාත්‍රී අහස ඒකාලෝක කරමින්",
      },
      {
        icon: "🙏",
        headline: "ආශිර්වාද කාඩ්පත සූදානම් වෙමින් පවතී...",
        sub: "මෙම සුබපැතුම ලබන සැමටම මහත් වූ පින් අත්පත් වේවා",
      },
    ],

    cardMessages: [
      "උතුම් දහම් ආලෝකය ඔබේ ජීවිතය ඒකාලෝක කරත්වා! පින්බර පොසොන් මංගල්‍යයක් වේවා!\n\n https://happy-poson.vercel.app/",
      "ඔබට සාමය, ප්‍රඥාව සහ කරුණාව පිරි වාසනාවන්ත පොසොන් පොහෝ දිනයක් වේවා!\n\n https://happy-poson.vercel.app/",
      "සාදු • සාදු • සාදු! උතුම් පොසොන් මංගල්‍යයේ ආශිර්වාදය ලැබේවා!\n\n https://happy-poson.vercel.app/",
      "සියලු සත්වයෝ සුවපත් වෙත්වා! රැස් කළ පින් සියලු ලෝකයාටම අත්වේවා!\n\n https://happy-poson.vercel.app/",
    ],
  },
} as const;

// ─── Language Context ─────────────────────────────────────────────────────────
export const LangContext = createContext<{
  lang: Lang;
  toggle: () => void;
  t: typeof translations.en | typeof translations.si;
}>({
  lang: "si",
  toggle: () => {},
  t: translations.si,
});

export const useLang = () => useContext(LangContext);

// ─── Language Toggle Button ───────────────────────────────────────────────────
const LangToggle = ({ compact = false }: { compact?: boolean }) => {
  const { lang, toggle } = useLang();
  return (
    <button
      onClick={toggle}
      title={lang === "en" ? "Switch to Sinhala" : "ඉංග්‍රීසි භාෂාවට මාරු වන්න"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: compact ? "5px 10px" : "6px 14px",
        borderRadius: 99,
        background: "rgba(141,161,205,0.12)",
        border: "1px solid rgba(141,161,205,0.35)",
        color: "#8da1cd",
        fontFamily: lang === "si" ? "'Noto Serif Sinhala', serif" : "Cinzel",
        fontSize: compact ? 11 : 10,
        fontWeight: 600,
        letterSpacing: "0.08em",
        cursor: "pointer",
        transition: "all 0.2s",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(141,161,205,0.22)";
        e.currentTarget.style.borderColor = "rgba(141,161,205,0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(141,161,205,0.12)";
        e.currentTarget.style.borderColor = "rgba(141,161,205,0.35)";
      }}
    >
      <span style={{ fontSize: 13 }}>{lang === "en" ? "LK" : "UK"}</span>
      {lang === "en" ? "සිංහල" : "English"}
    </button>
  );
};

// ─── Dharma Wheel SVG ────────────────────────────────────────────────────────
const DharmaWheel = ({
  size = 32,
  color = "#c9923a",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="32"
      cy="32"
      r="28"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
    />
    <circle
      cx="32"
      cy="32"
      r="6"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
    />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const x1 = 32 + 6 * Math.cos(rad);
      const y1 = 32 + 6 * Math.sin(rad);
      const x2 = 32 + 26 * Math.cos(rad);
      const y2 = 32 + 26 * Math.sin(rad);
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    })}
  </svg>
);

// ─── Buddhist Flag Colors Bar ─────────────────────────────────────────────────
const FlagStripes = () => (
  <div
    style={{
      display: "flex",
      width: "100%",
      height: "4px",
      borderRadius: "2px",
      overflow: "hidden",
    }}
  >
    {["#1a4fd4", "#e6b800", "#e63c00", "#ffffff", "#e87c2a"].map((c, i) => (
      <div key={i} style={{ flex: 1, background: c }} />
    ))}
  </div>
);

// ─── Lantern SVG ─────────────────────────────────────────────────────────────
const LanternIcon = ({ color = "#f5c26b" }: { color?: string }) => (
  <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
    <rect x="6" y="0" width="6" height="3" rx="1" fill={color} opacity="0.7" />
    <rect
      x="2"
      y="3"
      width="14"
      height="18"
      rx="5"
      fill={color}
      opacity="0.5"
      stroke={color}
      strokeWidth="1.5"
    />
    <ellipse cx="9" cy="12" rx="4" ry="5" fill={color} opacity="0.35" />
    <line
      x1="7"
      y1="21"
      x2="6"
      y2="28"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <line
      x1="9"
      y1="21"
      x2="9"
      y2="28"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <line
      x1="11"
      y1="21"
      x2="12"
      y2="28"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

// ─── Hamburger Button ─────────────────────────────────────────────────────────
const HamburgerBtn = ({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    aria-label={open ? "Close menu" : "Open menu"}
    aria-expanded={open}
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 5,
      width: 40,
      height: 40,
      background: "rgba(201,146,58,0.08)",
      border: "1px solid rgba(201,146,58,0.25)",
      borderRadius: 6,
      cursor: "pointer",
      padding: 0,
      flexShrink: 0,
      transition: "background 0.2s, border-color 0.2s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(201,146,58,0.18)";
      e.currentTarget.style.borderColor = "rgba(201,146,58,0.5)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(201,146,58,0.08)";
      e.currentTarget.style.borderColor = "rgba(201,146,58,0.25)";
    }}
  >
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          display: "block",
          width: 20,
          height: 1.5,
          background: "#f5c26b",
          borderRadius: 2,
          transformOrigin: "center",
          transition:
            "transform 0.3s cubic-bezier(.22,.68,0,1.2), opacity 0.2s",
          transform: open
            ? i === 0
              ? "translateY(6.5px) rotate(45deg)"
              : i === 2
                ? "translateY(-6.5px) rotate(-45deg)"
                : "scaleX(0)"
            : "none",
          opacity: open && i === 1 ? 0 : 1,
        }}
      />
    ))}
  </button>
);

// ─── Mobile Menu Overlay ──────────────────────────────────────────────────────
const MobileMenu = ({
  open,
  onClose,
  onShareCard,
}: {
  open: boolean;
  onClose: () => void;
  onShareCard: () => void;
}) => {
  const { t, lang } = useLang();

  return (
    <div
      aria-hidden={!open}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99,
        background: "rgba(6, 13, 31, 0.82)",
        backdropFilter: "blur(24px) saturate(1.5)",
        WebkitBackdropFilter: "blur(24px) saturate(1.5)",
        borderBottom: "1px solid rgba(201,146,58,0.18)",
        clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        transition: "clip-path 0.45s cubic-bezier(.22,.68,0,1.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 32px 40px",
        gap: 0,
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
        }}
      >
        <FlagStripes />
      </div>

      <div
        style={{
          marginBottom: 40,
          opacity: open ? 1 : 0,
          transform: open ? "scale(1)" : "scale(0.6)",
          transition: "opacity 0.4s 0.15s, transform 0.4s 0.15s",
          animation: "spinSlow 20s linear infinite",
        }}
      >
        <DharmaWheel size={48} color="#c9923a55" />
      </div>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          width: "100%",
          maxWidth: 320,
        }}
      >
        <div
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.35s 0.36s, transform 0.35s 0.36s",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <LangToggle compact />
        </div>

        <button
          onClick={() => {
            onClose();
            onShareCard();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            width: "100%",
            padding: "16px 24px",
            borderRadius: 6,
            background: "rgba(212,132,154,0.1)",
            border: "1px solid rgba(212,132,154,0.4)",
            color: "#d4849a",
            fontFamily:
              lang === "si" ? "'Noto Serif Sinhala', serif" : "Cinzel",
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: lang === "si" ? "0.02em" : "0.12em",
            textTransform: lang === "si" ? "none" : "uppercase",
            cursor: "pointer",
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(16px)",
            transition: `opacity 0.35s 0.45s, transform 0.35s 0.45s, background 0.2s`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(212,132,154,0.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(212,132,154,0.1)";
          }}
        >
          <span style={{ fontSize: 16 }}>🪷</span>
          {t.navShareCardFull}
        </button>
      </nav>

      <div
        style={{
          position: "absolute",
          bottom: 36,
          display: "flex",
          gap: 24,
          opacity: open ? 0.7 : 0,
          transition: "opacity 0.4s 0.5s",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="lantern-float"
            style={{ animationDelay: `${i * -1.3}s` }}
          >
            <LanternIcon color={["#f5c26b", "#d4849a", "#8da1cd"][i]} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── 3D Loader Overlay ────────────────────────────────────────────────────────
const LoaderOverlay = ({ progress }: { progress: number }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "#060d1fc0",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 200,
      fontFamily: "sans-serif",
      color: "#ffffff",
    }}
  >
    {/* Spiritual/Cultural Loading Accent Ring */}
    <div style={{ position: "relative", marginBottom: "24px" }}>
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          border: "3px solid rgba(245, 158, 11, 0.1)",
          borderTop: "3px solid #f59e0b",
          animation: "spin 1s linear infinite",
        }}
      />
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "20px",
        }}
      >
        🪷
      </span>
    </div>

    <h2
      style={{
        fontSize: "18px",
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#f3f4f6",
        margin: "0 0 8px 0",
      }}
    >
      Initializing Engine
    </h2>
    <p
      style={{
        fontSize: "12px",
        color: "#9ca3af",
        margin: "0 0 20px 0",
        fontFamily: "monospace",
      }}
    >
      Assembling 3D Heritage Matrix Layer...
    </p>

    {/* Progress Bar */}
    <div
      style={{
        width: "200px",
        height: "4px",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: "999px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: "linear-gradient(90deg, #f59e0b, #eab308)",
          boxShadow: "0 0 12px #f59e0b",
          transition: "width 0.2s ease-out",
        }}
      />
    </div>

    <span
      style={{
        fontSize: "11px",
        fontFamily: "monospace",
        color: "#eab308",
        marginTop: "8px",
        fontWeight: "bold",
      }}
    >
      {progress}%
    </span>
  </div>
);

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [showShareCard, setShowShareCard] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("si");

  const toggle = () => setLang((l) => (l === "en" ? "si" : "en"));
  const t = translations[lang];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
  }, [mobileMenuOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {}, 300);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("card") === "poson") {
      setShowShareCard(true);
    }
  }, []);

  // Font family helpers
  const sinhalaFont = "'Noto Serif Sinhala', serif";
  const headingFont = lang === "si" ? sinhalaFont : "Cinzel";
  const labelFont = lang === "si" ? sinhalaFont : "Inter";
  const heroFont = lang === "si" ? sinhalaFont : "Cinzel";

  const heroOpacity = Math.max(0, 1 - scrollY / 300);

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500&family=Noto+Serif+Sinhala:wght@400;700;900&display=swap');

          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            background: #060d1f;
            color: #f0ede0;
            font-family: 'Inter', sans-serif;
            overflow-x: hidden;
          }

          ::-webkit-scrollbar { width: 5px; }
          ::-webkit-scrollbar-track { background: #060d1f; }
          ::-webkit-scrollbar-thumb { background: #c9923a55; border-radius: 99px; }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmer {
            0%, 100% { opacity: 0.6; }
            50%       { opacity: 1; }
          }
          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes spin {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes floatLantern {
            0%, 100% { transform: translateY(0px) rotate(-2deg); }
            50%       { transform: translateY(-10px) rotate(2deg); }
          }
          @keyframes glow {
            0%, 100% { text-shadow: 0 0 20px #c9923a55, 0 0 40px #c9923a22; }
            50%       { text-shadow: 0 0 30px #c9923a99, 0 0 60px #c9923a44; }
          }
          @keyframes sharePulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(212, 132, 154, 0.4); }
            50%       { box-shadow: 0 0 0 8px rgba(212, 132, 154, 0); }
          }
          @keyframes langSwitch {
            0%   { opacity: 0; transform: translateY(6px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .fade-up { animation: fadeUp 0.9s cubic-bezier(.22,.68,0,1.2) both; }
          .delay-1 { animation-delay: 0.15s; }
          .delay-2 { animation-delay: 0.3s; }
          .delay-3 { animation-delay: 0.45s; }
          .delay-4 { animation-delay: 0.6s; }
          .delay-5 { animation-delay: 0.75s; }

          .lang-switch { animation: langSwitch 0.3s ease both; }

          .glass {
            background: rgba(6, 13, 31, 0.55);
            backdrop-filter: blur(18px) saturate(1.4);
            -webkit-backdrop-filter: blur(18px) saturate(1.4);
            border: 1px solid rgba(201, 146, 58, 0.22);
          }

          .gold-text {
            color: #c9923a;
            animation: glow 3s ease-in-out infinite;
          }

          .nav-link {
            color: #f0ede0;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            opacity: 0.75;
            transition: opacity 0.2s, color 0.2s;
          }
          .nav-link:hover { opacity: 1; color: #f5c26b; }

          .nav-link-si {
            color: #f0ede0;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Noto Serif Sinhala', serif;
            opacity: 0.75;
            transition: opacity 0.2s, color 0.2s;
          }
          .nav-link-si:hover { opacity: 1; color: #f5c26b; }

          .info-card {
            transition: transform 0.3s ease, border-color 0.3s ease;
          }
          .info-card:hover {
            transform: translateY(-4px);
            border-color: rgba(201, 146, 58, 0.5) !important;
          }

          .section-divider {
            width: 60px; height: 2px;
            background: linear-gradient(90deg, #c9923a, transparent);
            margin: 16px auto 0;
          }

          .lantern-float { animation: floatLantern 4s ease-in-out infinite; }
          .lantern-float:nth-child(2) { animation-delay: -1.3s; }
          .lantern-float:nth-child(3) { animation-delay: -2.6s; }

          .share-card-btn { animation: sharePulse 2.5s ease-in-out 1.5s infinite; }

          .nav-desktop { display: flex; }
          .nav-hamburger { display: none; }

          @media (max-width: 768px) {
            .nav-desktop { display: none !important; }
            .nav-hamburger { display: flex !important; }
            .hero-title { font-size: clamp(2rem, 10vw, 3.5rem) !important; }
            .info-grid { grid-template-columns: 1fr !important; }
            .hero-cta-row { flex-direction: column !important; align-items: stretch !important; }
            .hero-cta-row a, .hero-cta-row button { justify-content: center !important; }
          }

          @media (max-width: 480px) {
            .hero-title { font-size: clamp(1.75rem, 9vw, 3rem) !important; }
          }
        `}</style>

        {/* ── 3D Scene Loader Overlay ── */}
        {!sceneLoaded && <LoaderOverlay progress={sceneProgress} />}

        {/* ── Fixed 3D Canvas ── */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
          <ThreeCanvas
            onProgress={setSceneProgress}
            onLoaded={() => setSceneLoaded(true)}
          />
        </div>

        {/* ── Share Card Modal ── */}
        {showShareCard && (
          <PosonCardShare onClose={() => setShowShareCard(false)} />
        )}

        {/* ── Mobile Menu Overlay ── */}
        <MobileMenu
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          onShareCard={() => setShowShareCard(true)}
        />

        {/* ── Scrollable Content ── */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* ── NAV ── */}
          <nav
            className="glass"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 24px",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              borderBottom: "1px solid rgba(201,146,58,0.18)",
              transition: "background 0.4s",
            }}
          >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  animation: "spinSlow 20s linear infinite",
                  display: "flex",
                }}
              >
                <DharmaWheel size={26} color="#c9923a" />
              </div>
              <span
                style={{
                  fontFamily: headingFont,
                  fontSize: lang === "si" ? 15 : 14,
                  fontWeight: 700,
                  letterSpacing: lang === "si" ? "0.02em" : "0.1em",
                  color: "#f5c26b",
                }}
                key={lang}
                className="lang-switch"
              >
                {t.navBrand}
              </span>
            </div>

            {/* Desktop right actions */}
            <div
              className="nav-desktop"
              style={{ gap: 8, alignItems: "center" }}
            >
              <LangToggle />

              <button
                onClick={() => setShowShareCard(true)}
                style={{
                  background: "rgba(212,132,154,0.12)",
                  border: "1px solid rgba(212,132,154,0.3)",
                  borderRadius: 99,
                  color: "#d4849a",
                  fontFamily: headingFont,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: lang === "si" ? "0.02em" : "0.12em",
                  textTransform: lang === "si" ? "none" : "uppercase",
                  padding: "6px 14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(212,132,154,0.2)";
                  e.currentTarget.style.borderColor = "rgba(212,132,154,0.55)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(212,132,154,0.12)";
                  e.currentTarget.style.borderColor = "rgba(212,132,154,0.3)";
                }}
              >
                🪷 {t.navShareCard}
              </button>

              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="lantern-float"
                  style={{ display: "flex", animationDelay: `${i * -1.3}s` }}
                >
                  <LanternIcon color={["#f5c26b", "#d4849a", "#8da1cd"][i]} />
                </div>
              ))}
            </div>

            {/* Mobile right: lantern + hamburger */}
            <div
              className="nav-hamburger"
              style={{ alignItems: "center", gap: 12 }}
            >
              <div className="lantern-float" style={{ display: "flex" }}>
                <LanternIcon color="#f5c26b" />
              </div>
              <HamburgerBtn
                open={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((v) => !v)}
              />
            </div>
          </nav>

          {/* ── HERO ── */}
          <section
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "80px 24px 40px",
              opacity: heroOpacity,
              transition: "opacity 0.25s ease-out",
              pointerEvents: "none",
            }}
          >
            <h1
              key={`hero-${lang}`}
              className="hero-title fade-up gold-text lang-switch"
              style={{
                fontFamily: heroFont,
                fontWeight: 900,
                fontSize:
                  lang === "si"
                    ? "clamp(2rem, 5.5vw, 4.2rem)"
                    : "clamp(2.2rem, 6vw, 4.8rem)",
                lineHeight: 1.35,
                letterSpacing: lang === "si" ? "0.01em" : "0.02em",
                textShadow:
                  "0 0 15px rgba(245, 194, 107, 0.65), 0 0 30px rgba(245, 194, 107, 0.25)",
                color: "#f5c26b",
                marginBottom: 16,
                maxWidth: "960px",
                pointerEvents: "auto",
              }}
            >
              {t.heroTitle}
            </h1>

            <p
              key={`hero-sub-${lang}`}
              className="fade-up delay-1 lang-switch"
              style={{
                fontFamily: lang === "si" ? sinhalaFont : "'Inter', sans-serif",
                fontSize: "clamp(0.9rem, 2vw, 1.15rem)",
                letterSpacing: lang === "si" ? "0.05em" : "0.25em",
                textTransform: lang === "si" ? "none" : "uppercase",
                color: "#f0ede0",
                opacity: 0.85,
                marginBottom: 40,
                pointerEvents: "auto",
              }}
            >
              {t.heroSubtitle}
            </p>

            <button
              onClick={() => setShowShareCard(true)}
              className="fade-up delay-2 share-card-btn"
              style={{
                background: "rgba(212, 132, 154, 0.12)",
                backdropFilter: "blur(18px) saturate(1.4)",
                WebkitBackdropFilter: "blur(18px) saturate(1.4)",
                border: "1px solid rgba(212, 132, 154, 0.4)",
                borderRadius: 99,
                color: "#f0ede0",
                fontFamily: headingFont,
                fontSize: "clamp(13px, 3.5vw, 16px)",
                fontWeight: 700,
                letterSpacing: lang === "si" ? "0.02em" : "0.12em",
                textTransform: lang === "si" ? "none" : "uppercase",
                padding: "16px 36px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                whiteSpace: "nowrap",
                pointerEvents: "auto",
                boxShadow:
                  "0 8px 32px rgba(212, 132, 154, 0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
                position: "relative",
                zIndex: 1,
                marginBottom: 40,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.background = "rgba(212, 132, 154, 0.22)";
                e.currentTarget.style.borderColor = "rgba(212, 132, 154, 0.65)";
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(212, 132, 154, 0.35), inset 0 1px 0 rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.background = "rgba(212, 132, 154, 0.12)";
                e.currentTarget.style.borderColor = "rgba(212, 132, 154, 0.4)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(212, 132, 154, 0.2), inset 0 1px 0 rgba(255,255,255,0.08)";
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>🪷</span>
              {t.navShareCard}
            </button>

            {/* <button
              onClick={() => {
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="fade-up delay-3"
              style={{
                background: "rgba(201, 146, 58, 0.08)",
                backdropFilter: "blur(18px) saturate(1.4)",
                WebkitBackdropFilter: "blur(18px) saturate(1.4)",
                border: "1px solid rgba(201, 146, 58, 0.28)",
                borderRadius: 99,
                color: "#f5c26b",
                fontFamily: labelFont,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                padding: "10px 24px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                pointerEvents: "auto",
                boxShadow:
                  "0 4px 20px rgba(201, 146, 58, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
                marginBottom: 40,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201, 146, 58, 0.16)";
                e.currentTarget.style.borderColor = "rgba(201, 146, 58, 0.5)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(201, 146, 58, 0.08)";
                e.currentTarget.style.borderColor = "rgba(201, 146, 58, 0.28)";
                e.currentTarget.style.transform = "none";
              }}
            >
              {t.heroScrollHint}
              <span
                style={{
                  fontSize: 14,
                  animation: "shimmer 2s ease-in-out infinite",
                }}
              >
                ↓
              </span>
            </button> */}

            <div
              style={{
                position: "absolute",
                bottom: 40,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                animation: "shimmer 2s ease-in-out infinite",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  opacity: 0.5,
                  color: "#f0ede0",
                }}
              >
                {t.heroScrollHint}
              </span>
              <div
                style={{
                  width: 1,
                  height: 50,
                  background:
                    "linear-gradient(180deg, #f5c26b 0%, transparent 100%)",
                }}
              />
            </div>
          </section>

          {/* ── ABOUT ── */}
          <section
            id="about"
            style={{
              padding: "100px 24px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              className="glass"
              style={{
                maxWidth: 860,
                width: "100%",
                borderRadius: 8,
                padding: "clamp(32px, 5vw, 60px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 32,
                }}
              >
                <DharmaWheel size={22} color="#c9923a" />
                <span
                  key={`about-label-${lang}`}
                  className="lang-switch"
                  style={{
                    fontFamily: labelFont,
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#c9923a",
                  }}
                >
                  {t.aboutLabel}
                </span>
              </div>

              <h2
                key={`about-title-${lang}`}
                className="lang-switch"
                style={{
                  fontFamily: headingFont,
                  fontWeight: 700,
                  fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                  color: "#f5c26b",
                  marginBottom: 20,
                  lineHeight: 1.35,
                }}
              >
                {t.aboutTitle}
              </h2>

              <p
                key={`about-p1-${lang}`}
                className="lang-switch"
                style={{
                  fontFamily: lang === "si" ? sinhalaFont : "inherit",
                  lineHeight: 1.85,
                  opacity: 0.78,
                  fontSize: "1.02rem",
                  marginBottom: 20,
                }}
              >
                {t.aboutP1}
              </p>

              <p
                key={`about-p2-${lang}`}
                className="lang-switch"
                style={{
                  fontFamily: lang === "si" ? sinhalaFont : "inherit",
                  lineHeight: 1.85,
                  opacity: 0.78,
                  fontSize: "1.02rem",
                  marginBottom: 20,
                }}
              >
                {t.aboutP2}
              </p>

              <p
                key={`about-p3-${lang}`}
                className="lang-switch"
                style={{
                  fontFamily: lang === "si" ? sinhalaFont : "inherit",
                  lineHeight: 1.85,
                  opacity: 0.78,
                  fontSize: "1.02rem",
                  marginBottom: 32,
                }}
              >
                {t.aboutP3}
              </p>

              <FlagStripes />

              <div
                className="info-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 20,
                  marginTop: 36,
                }}
              >
                {[
                  { num: t.stat1Num, label: t.stat1Label },
                  { num: t.stat2Num, label: t.stat2Label },
                  { num: t.stat3Num, label: t.stat3Label },
                ].map(({ num, label }) => (
                  <div
                    key={num}
                    className="glass info-card"
                    style={{
                      borderRadius: 6,
                      padding: "24px 20px",
                      textAlign: "center",
                      border: "1px solid rgba(201,146,58,0.2)",
                    }}
                  >
                    <div
                      key={`stat-num-${lang}-${num}`}
                      className="lang-switch"
                      style={{
                        fontFamily: headingFont,
                        fontWeight: 700,
                        fontSize: "clamp(1rem, 3vw, 1.5rem)",
                        color: "#f5c26b",
                        marginBottom: 8,
                      }}
                    >
                      {num}
                    </div>
                    <div
                      key={`stat-label-${lang}-${num}`}
                      className="lang-switch"
                      style={{
                        fontFamily: lang === "si" ? sinhalaFont : "inherit",
                        fontSize: 12,
                        opacity: 0.6,
                        letterSpacing: "0.05em",
                        lineHeight: 1.4,
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer
            className="glass"
            style={{
              padding: "28px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "none",
              borderLeft: "none",
              borderRight: "none",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <DharmaWheel size={18} color="#c9923a88" />
              <span
                style={{
                  fontFamily: headingFont,
                  fontSize: 12,
                  color: "#f5c26b",
                  opacity: 0.6,
                }}
              >
                {t.navBrand} ·{" "}
              </span>
            </div>
            <FlagStripes />
            <span
              style={{ fontSize: 11, opacity: 0.35, letterSpacing: "0.05em" }}
            >
              {t.footerRegion}
            </span>
          </footer>
        </div>
      </>
    </LangContext.Provider>
  );
}
