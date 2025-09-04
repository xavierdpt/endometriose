Generate an entry for  flagellin using these instructions.

**Prompt for “Entry‑Generator”**  

> **Task**  
>  Produce a concise, encyclopedic entry for the subject given in the *Title*.  The output must **begin with an introductory paragraph** (2–3 sentences) that gives a quick, high‑level overview.  This paragraph comes first, followed by the structured sections below.  
>  The same template can be freely adapted for any of the following:  
>  • Molecules (simple, peptides, lipids, nucleic acids, etc.)  
>  • Proteins, enzymes, or other macromolecules  
>  • Cell types, organs, or organ systems  
>  • Biological pathways or signaling cascades  
>  • Mitochondrial or ribosomal complexes  
>  • Diseases, pathologic conditions, or syndromes  

> **Formatting Rules (OpenAI style)**  
> 1. Use Markdown **only when semantically relevant** (headings, lists, tables, code fences).  
> 2. Identifier names (gene/protein names, enzyme names, class tags, function names, directory paths, etc.) → back‑ticks (`).  
> 3. Mathematical expressions → \( … \) (inline) or \[ … \] (display).  
> 4. Do NOT add any extraneous commentary or “I think” phrasing.  
> 5. Keep each section concise (1–3 sentences or a short bullet list).

> **Required Sections (modifiable per subject)**  

> ### 1. Introductory Summary  
>  · 2–3 sentences giving a high‑level snapshot of the subject’s identity, main role, and importance.  

> ### 2. Location & Context  
>  · Where the subject is found (cellular location, organ, tissue, sub‑cellular compartment, extracellular environment).  
>  · Typical abundance or expression levels.  

> ### 3. Classification & Structure  (if applicable)
>  · Taxonomy, family, or functional class.  
>  · Key structural features (domains, motifs, ring systems, etc.).  

> ### 4. Physiological / Biological Function   (if applicable)
>  · Core role(s) in normal biology.  
>  · Key downstream effects (signaling cascade, metabolic outcome).  

> ### 5. Molecular/Structural Derivatives (if applicable)  
>  · Naturally occurring analogs, metabolites, splice variants.  
>  · Post‑translational modifications (for proteins).  

> ### 6. Metabolism & Biotransformation (if applicable)
>  · Major biosynthetic & degradative pathways.  
>  · Enzymes and cofactors involved.  

> ### 7. Receptor Binding & Signaling (if applicable)
>  · Known receptors or binding partners.  
>  · Mode of action (genomic vs. non‑genomic, kinase cascades).  

> ### 8. Tissue‑Specific Actions (if applicable)
>  · Differential effects in distinct cell types or organs.  

> ### 9. Interaction with Other Biomolecules  (if applicable)
>  · Cross‑talk with hormones, metabolites, transcription factors, etc.  

> ### 10. Genetic Polymorphisms & Variants  (if applicable)
>  · Functional SNPs, copy‑number variants, pathogenic mutations.  

> ### 11. Dietary & Environmental Influences  (if applicable)
>  · Nutrients, xenobiotics, lifestyle factors that modulate the subject.  

> ### 12. Pathophysiological Associations  (if applicable)
>  · Key clinical features, biomarkers, or complications.  

> **Optional Sections** (include only if applicable )  
> • Clinical biomarkers / diagnostic tests (for pathological entries).  
> • Therapeutic relevance / drug targeting (for drugs, enzymes, receptors).  
> • Molecular pathways (for signaling pathways).  

> **How to Use (freely adapted)**  
> 1. Replace *Title* with the subject you want to describe.  
> 2. (Optional) Add a *Specification* line to hint at parts of the template you’d like to emphasize.  
> 3. Feed the prompt to the model.  The model will generate the entry, starting with the required introductory paragraph, followed by the chosen sections.  
> 4. The output can be edited, reordered, or expanded to suit your specific needs.

---

**Sample Prompt (copy‑paste ready)**  

> ```
> Title: <insert_subject_here>
> 
> [Optional:] Specification: <short_description>
> 
> Generate a concise encyclopedic entry, beginning with an introductory paragraph (2–3 sentences).  Follow the structured sections listed above, observing the formatting rules.  The generated entry may be freely adapted to fit the intended application.  
> ```

Replace `<insert_subject_here>` with the entity you wish to describe (e.g., *Estrogen‑responsive element‑binding protein 1*, *Neutrophil*, *DNA repair via homologous recombination*, *Glycine accumulation in hepatic cells*, *Asthma*, etc.).