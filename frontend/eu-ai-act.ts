export const aiActData: Record<string, { title: string; text: string }> = {
    'Article 5': {
        title: 'Article 5: Prohibited AI practices',
        text: `1. The following AI practices shall be prohibited:
(a) the placing on the market, the putting into service or the use of an AI system that deploys subliminal techniques beyond a person’s consciousness or purposefully manipulative or deceptive techniques, with the objective, or the effect of materially distorting the behaviour of a person or a group of persons by appreciably impairing their ability to make an informed decision, thereby causing them to take a decision that they would not have otherwise taken in a manner that causes or is reasonably likely to cause that person, another person or group of persons significant harm;
(b) the placing on the market, the putting into service or the use of an AI system that exploits any of the vulnerabilities of a natural person or a specific group of persons due to their age, disability or a specific social or economic situation, with the objective, or the effect, of materially distorting the behaviour of that person or a person belonging to that group in a manner that causes or is reasonably likely to cause that person or another person significant harm;
(c) the placing on the market, the putting into service or the use of AI systems for the evaluation or classification of natural persons or groups of persons over a certain period of time based on their social behaviour or known, inferred or predicted personal or personality characteristics, with the social score leading to either or both of the following:
(i) detrimental or unfavourable treatment of certain natural persons or groups of persons in social contexts that are unrelated to the contexts in which the data was originally generated or collected;
(ii) detrimental or unfavourable treatment of certain natural persons or groups of persons that is unjustified or disproportionate to their social behaviour or its gravity;
(d) the placing on the market, the putting into service for this specific purpose, or the use of an AI system for making risk assessments of natural persons in order to assess or predict the risk of a natural person committing a criminal offence, based solely on the profiling of a natural person or on assessing their personality traits and characteristics; this prohibition shall not apply to AI systems used to support the human assessment of the involvement of a person in a criminal activity, which is already based on objective and verifiable facts directly linked to a criminal activity;
(e) the placing on the market, the putting into service for this specific purpose, or the use of AI systems that create or expand facial recognition databases through the untargeted scraping of facial images from the internet or CCTV footage;
(f) the placing on the market, the putting into service for this specific purpose, or the use of AI systems to infer emotions of a natural person in the areas of workplace and education institutions, except where the use of the AI system is intended to be put in place or into the market for medical or safety reasons;
(g) the placing on the market, the putting into service for this specific purpose, or the use of biometric categorisation systems that categorise individually natural persons based on their biometric data to deduce or infer their race, political opinions, trade union membership, religious or philosophical beliefs, sex life or sexual orientation; this prohibition does not cover any labelling or filtering of lawfully acquired biometric datasets, such as images, based on biometric data or categorizing of biometric data in the area of law enforcement;
(h) the use of ‘real-time’ remote biometric identification systems in publicly accessible spaces for the purposes of law enforcement, unless and in so far as such use is strictly necessary for one of the following objectives:
(i) the targeted search for specific victims of abduction, trafficking in human beings or sexual exploitation of human beings, as well as the search for missing persons;
(ii) the prevention of a specific, substantial and imminent threat to the life or physical safety of natural persons or a genuine and present or genuine and foreseeable threat of a terrorist attack;
(iii) the localisation or identification of a person suspected of having committed a criminal offence, for the purpose of conducting a criminal investigation or prosecution or executing a criminal penalty for offences referred to in Annex II and punishable in the Member State concerned by a custodial sentence or a detention order for a maximum period of at least four years.`
    },
    'Article 6': {
      title: 'Article 6: Classification rules for high-risk AI systems',
      text: `1. Irrespective of whether an AI system is placed on the market or put into service independently of the products referred to in points (a) and (b), that AI system shall be considered to be high-risk where both of the following conditions are fulfilled:
(a) the AI system is intended to be used as a safety component of a product, or the AI system is itself a product, covered by the Union harmonisation legislation listed in Annex I;
(b) the product whose safety component pursuant to point (a) is the AI system, or the AI system itself as a product, is required to undergo a third-party conformity assessment, with a view to the placing on the market or the putting into service of that product pursuant to the Union harmonisation legislation listed in Annex I.
2. In addition to the high-risk AI systems referred to in paragraph 1, AI systems referred to in Annex III shall be considered to be high-risk.`
    },
    'Article 7': {
        title: 'Article 7: Amendments to Annex III',
        text: `1. The Commission is empowered to adopt delegated acts in accordance with Article 97 to amend Annex III by adding or modifying use-cases of high-risk AI systems where both of the following conditions are fulfilled:
(a) the AI systems are intended to be used in any of the areas listed in Annex III;
(b) the AI systems pose a risk of harm to health and safety, or an adverse impact on fundamental rights, and that risk is equivalent to, or greater than, the risk of harm or of adverse impact posed by the high-risk AI systems already referred to in Annex III.
2. When assessing the condition under paragraph 1, point (b), the Commission shall take into account the following criteria: (a) the intended purpose of the AI system; (b) the extent to which an AI system has been used or is likely to be used; (c) the nature and amount of the data processed and used by the AI system... [and other criteria as per the full Act]`
    },
    'Article 9': {
      title: 'Article 9: Risk management system',
      text: `1. A risk management system shall be established, implemented, documented and maintained in relation to high-risk AI systems.\n\n2. The risk management system shall be understood as a continuous iterative process planned and run throughout the entire lifecycle of a high-risk AI system, requiring regular systematic review and updating. It shall comprise the following steps:\n(a) the identification and analysis of the known and the reasonably foreseeable risks that the high-risk AI system can pose to health, safety or fundamental rights when the high-risk AI system is used in accordance with its intended purpose;\n(b) the estimation and evaluation of the risks that may emerge when the high-risk AI system is used in accordance with its intended purpose, and under conditions of reasonably foreseeable misuse;\n(c) the evaluation of other risks possibly arising, based on the analysis of data gathered from the post-market monitoring system referred to in Article 72;\n(d) the adoption of appropriate and targeted risk management measures designed to address the risks identified...\n\n3. The risks referred to in this Article shall concern only those which may be reasonably mitigated or eliminated through the development or design of the high-risk AI system, or the provision of adequate technical information.\n\n4. The risk management measures...shall give due consideration to the effects and possible interaction resulting from the combined application of the requirements set out in this Section...\n\n5. The risk management measures...shall be such that the relevant residual risk associated with each hazard, as well as the overall residual risk of the high-risk AI systems is judged to be acceptable.`
    },
    'Article 10': {
        title: 'Article 10: Data and data governance',
        text: `1. High-risk AI systems which make use of techniques involving the training of AI models with data shall be developed on the basis of training, validation and testing data sets that meet the quality criteria referred to in paragraphs 2 to 5 whenever such data sets are used.\n\n2. Training, validation and testing data sets shall be subject to data governance and management practices appropriate for the intended purpose of the high-risk AI system. Those practices shall concern in particular:\n(a) the relevant design choices;\n(b) data collection processes and the origin of data, and in the case of personal data, the original purpose of the data collection;\n(c) relevant data-preparation processing operations, such as annotation, labelling, cleaning, updating, enrichment and aggregation;\n(d) the formulation of assumptions, in particular with respect to the information that the data are supposed to measure and represent;\n(e) an assessment of the availability, quantity and suitability of the data sets that are needed;\n(f) examination in view of possible biases that are likely to affect the health and safety of persons, have a negative impact on fundamental rights or lead to discrimination prohibited under Union law, especially where data outputs influence inputs for future operations;\n(g) appropriate measures to detect, prevent and mitigate possible biases identified according to point (f);\n(h) the identification of relevant data gaps or shortcomings that prevent compliance with this Regulation, and how those gaps and shortcomings can be addressed.\n\n3. Training, validation and testing data sets shall be relevant, sufficiently representative, and to the best extent possible, free of errors and complete in view of the intended purpose...`
    },
    'Article 11': {
        title: 'Article 11: Technical documentation',
        text: `1. The technical documentation of a high-risk AI system shall be drawn up before that system is placed on the market or put into service and shall be kept up-to date.\nThe technical documentation shall be drawn up in such a way as to demonstrate that the high-risk AI system complies with the requirements set out in this Section and to provide national competent authorities and notified bodies with the necessary information in a clear and comprehensive form to assess the compliance of the AI system with those requirements. It shall contain, at a minimum, the elements set out in Annex IV...\n\n2. Where a high-risk AI system related to a product covered by the Union harmonisation legislation listed in Section A of Annex I is placed on the market or put into service, a single set of technical documentation shall be drawn up containing all the information set out in paragraph 1, as well as the information required under those legal acts.\n\n3. The Commission is empowered to adopt delegated acts in accordance with Article 97 in order to amend Annex IV, where necessary, to ensure that, in light of technical progress, the technical documentation provides all the information necessary to assess the compliance of the system with the requirements set out in this Section.`
    },
    'Annex II': {
      title: 'Annex II: List of criminal offences referred to in Article 5(1), first subparagraph, point (h)(iii)',
      text: `Criminal offences referred to in Article 5(1), first subparagraph, point (h)(iii):
— terrorism,
— trafficking in human beings,
— sexual exploitation of children, and child pornography,
— illicit trafficking in narcotic drugs or psychotropic substances,
— illicit trafficking in weapons, munitions or explosives,
— murder, grievous bodily injury,
— illicit trade in human organs or tissue,
— illicit trafficking in nuclear or radioactive materials,
— kidnapping, illegal restraint or hostage-taking,
— crimes within the jurisdiction of the International Criminal Court,
— unlawful seizure of aircraft or ships,
— rape,
— environmental crime,
— organised or armed robbery,
— sabotage,
— participation in a criminal organisation involved in one or more of the offences listed above.`
    },
    'Annex III': {
      title: 'Annex III: High-risk AI systems referred to in Article 6(2)',
      text: `High-risk AI systems pursuant to Article 6(2) are the AI systems listed in any of the following areas:
1. Biometrics, in so far as their use is permitted under relevant Union or national law:
(a) remote biometric identification systems...
(b) AI systems intended to be used for biometric categorisation...
(c) AI systems intended to be used for emotion recognition.
2. Critical infrastructure...
3. Education and vocational training...
4. Employment, workers’ management and access to self-employment...
5. Access to and enjoyment of essential private services and essential public services and benefits...
6. Law enforcement, in so far as their use is permitted under relevant Union or national law:
(a) AI systems intended to be used by or on behalf of law enforcement authorities... to assess the risk of a natural person becoming the victim of criminal offences;
(b) ...as polygraphs or similar tools;
(c) ...to evaluate the reliability of evidence in the course of the investigation or prosecution of criminal offences;
(d) ...for assessing the risk of a natural person offending or re-offending...
(e) ...for the profiling of natural persons...
7. Migration, asylum and border control management...
(a) ...as polygraphs or similar tools;
(b) ...to assess a risk, including a security risk, a risk of irregular migration, or a health risk...
(c) ...to assist competent public authorities for the examination of applications for asylum, visa or residence permits...
(d) ...for the purpose of detecting, recognising or identifying natural persons, with the exception of the verification of travel documents.
8. Administration of justice and democratic processes:
(a) AI systems intended to be used by a judicial authority... to assist a judicial authority in researching and interpreting facts and the law...
(b) AI systems intended to be used for influencing the outcome of an election or referendum or the voting behaviour of natural persons...`
    },
    'Article 50': {
        title: 'Article 50: Transparency obligations for providers and deployers of certain AI systems',
        text: `1. Providers shall ensure that AI systems intended to interact directly with natural persons are designed and developed in such a way that the natural persons concerned are informed that they are interacting with an AI system, unless this is obvious... This obligation shall not apply to AI systems authorised by law to detect, prevent, investigate or prosecute criminal offences...
2. Providers of AI systems, including general-purpose AI systems, generating synthetic audio, image, video or text content, shall ensure that the outputs of the AI system are marked in a machine-readable format and detectable as artificially generated or manipulated...
3. Deployers of an emotion recognition system or a biometric categorisation system shall inform the natural persons exposed thereto of the operation of the system, and shall process the personal data in accordance with Regulations (EU) 2016/679...
4. Deployers of an AI system that generates or manipulates image, audio or video content constituting a deep fake, shall disclose that the content has been artificially generated or manipulated...`
    },
    'Article 52': { // For backwards compatibility if old prompt logic still calls this
      title: 'Article 50: Transparency obligations for providers and deployers of certain AI systems',
      text: `(This citation may be outdated. The relevant content is now in Article 50). 
      1. Providers shall ensure that AI systems intended to interact with natural persons are designed and developed in such a way that natural persons are informed that they are interacting with an AI system...`
    },
    'default': {
        title: 'EU AI Act Citation Not Found',
        text: 'The full text for this specific citation is not available in this demo. Please refer to the official documentation of the EU AI Act for details.'
    }
};

const normalizationMap: Record<string, keyof typeof aiActData> = {
    'article5': 'Article 5',
    'article6': 'Article 6',
    'article7': 'Article 7',
    'article9': 'Article 9',
    'article10': 'Article 10',
    'article11': 'Article 11',
    'article50': 'Article 50',
    'article52': 'Article 50',
    'annexii': 'Annex II',
    'annex2': 'Annex II',
    'annexiii': 'Annex III',
    'annex3': 'Annex III'
};
  
export const getActText = (citation: string) => {
    // Create a normalized key from the citation
    const key = citation.toLowerCase().replace(/[\s,.:()]/g, '');

    // Find the most specific match from our normalization map
    let bestMatchKey: string | null = null;
    for (const normKey in normalizationMap) {
        if (key.startsWith(normKey)) {
            if (!bestMatchKey || normKey.length > bestMatchKey.length) {
                bestMatchKey = normKey;
            }
        }
    }

    if (bestMatchKey && normalizationMap[bestMatchKey]) {
        const mappedKey = normalizationMap[bestMatchKey];
        return aiActData[mappedKey];
    }
    
    return aiActData['default'];
}