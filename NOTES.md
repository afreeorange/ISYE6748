## Some References

- Google [Course on Recommendation Systems](https://developers.google.com/machine-learning/recommendation)
- [Spotlight](https://github.com/maciejkula/spotlight) uses PyTorch to build both deep and shallow recommender models. [This is of special interest](https://github.com/maciejkula/spotlight/tree/master/examples/movielens_sequence)!
- [Matrix Factorization Techniques for Recommender Systems](https://towardsdatascience.com/paper-summary-matrix-factorization-techniques-for-recommender-systems-82d1a7ace74)
- [Building a Strong Baseline Recommender in PyTorch, on a Laptop](https://eugeneyan.com/writing/recommender-systems-baseline-pytorch/)
- [Building a Recommendation Engine With PyTorch](https://betterprogramming.pub/building-a-recommendation-engine-with-pytorch-d64be4856fe7) - Understanding the internals of recommendation engines
- [Collaborative Filtering in Pytorch](https://towardsdatascience.com/collaborative-filtering-in-pytorch-6e50515f01ae)
- [Medical code prediction via capsule networks and ICD knowledge](https://bmcmedinformdecismak.biomedcentral.com/articles/10.1186/s12911-021-01426-9#Tab2)
- [Building Recommendation Engine for Starbucks users](https://github.com/bdnf/SBX-Recommendation-Engine)

### Unsorted References

- https://medium.com/@medfordxie/neighborhood-vs-latent-factors-methods-in-collaborative-filter-recommender-systems-part-1-9f969c4990b0
- https://medium.com/@medfordxie/neighborhood-vs-latent-factors-methods-in-collaborative-filter-recommender-systems-part-3-e58dc49046b3
- https://medium.com/@toprak.mhmt/collaborative-filtering-3ceb89080ade
- https://medium.com/analytics-vidhya/recommendation-system-using-collaborative-filtering-cc310e641fde
- https://medium.com/fifty-five-data-science/recommender-systems-a-global-overview-c3a7370b3355
- https://medium.com/fnplus/neighbourhood-based-collaborative-filtering-4b7caedd2d11
- https://towardsdatascience.com/building-a-collaborative-filtering-recommender-system-with-tensorflow-82e63d27b420
- https://towardsdatascience.com/recommendation-system-series-part-1-an-executive-guide-to-building-recommendation-system-608f83e2630a
- https://towardsdatascience.com/recommendation-system-series-part-2-the-10-categories-of-deep-recommendation-systems-that-189d60287b58
- https://towardsdatascience.com/recommendation-system-series-part-3-the-6-research-directions-of-deep-recommendation-systems-that-3a328d264fb7
- https://towardsdatascience.com/recsys-series-part-4-the-7-variants-of-matrix-factorization-for-collaborative-filtering-368754e4fab5
- https://towardsdatascience.com/recsys-series-part-5-neural-matrix-factorization-for-collaborative-filtering-a0aebfe15883

---

# Report Mind-Dump

## TODO: Big Questions

- Why did we flatten the data to class frequencies?
- ~~Why are we going to use Collaborative filtering over Content filtering?~~
- The freaking problem of 'context': What do we do with the `Gender/Sex` column? Is it even applicable to Collaborative Filtering?
- ~~Will matrix factorization even be necessary in our case?~~ No. The whole point of matrix decomposition/factorization/dimensionality reduction is to discover a set of "concepts"/features or _latent factors_ or "generative forces" that explain user-item interactions. With latent factor models you want to capture the features that comprise the 'signals'. We don't care about that. Why? Because (a) one set of domain experts (the committee that determines ICD10 codes) have come up with the "concepts" and "latent factors" which are our classes and (b) another set of domain experts (the healthcare givers) have classified patients _into_ these classes! Sidenote: When you use SVD, you get $U \Sigma V^T$ (there's a nice math theorem that guarantees that any real-valued matrix _will_ decompose into U, V, and $\Sigma$). U would be the patient-to-feature matrix. $\Sigma$ would be the feature/class "strength" matrix which you apply to V _transposed_, which is the class-to-feature matrix (not the feature-to-class matrix!). U and V are similarity matrices. $\Sigma$ is a diagonal matrix that's all about feature strength.
- Why do we have (max) 4600 records for a patient? Multiple 'encounters' per day? Things might be complicated: Example: A patient is admitted for infusions. Each _hour_ that they're receiving infusions/treatment might be billed as an ICD/claim/encounter. Maybe they took the patient for an X-ray in the morning, an infusion in the evening, etc etc.

---

- The earliest admission date is `1959-04-02` (!!!) and the latest is `2019-08-22`.
  - An overwhelming (~90%) of encounters do _not_ have admission dates.
  - Only ~9% of encounters have available admission data
  - This field is used to determine the _age upon admission_ which we think is very important.
  - There is a lot of shit missing and we daresay that any usual interpolation/regression tricks won't work here.
  - We need to discard this field :(

### Other Predictors

Jurisdiction was limited to "Maryland", "Other", "District of Columbia", and "Virginia". There isn't much predictive power here.

[According to the AAFP](https://www.aafp.org/pubs/fpm/blogs/gettingpaid/entry/date_of_service_decides_whether.html), if the Date of Service was before October 1st 2014, you use ICD9 instead of ICD10. The Receipt Data field goes as far as 2017. Therefore, we can use ICD10 codes in lieu of ICD9.

### Feature Selection

## Model Building - Recommendation Systems

A modern recsys composes of "Global" effects, Matrix Factorization, and "Local" Collaborative Filtering. We combine these three 'views' (typically)

We tried a multi-scale modeling approach with just two out of the three typical layers: Global, Regional, and Local. We just used Global and Local. The regional typically involves factorization and we did not consider this necessary given that we assumed that feature selection and discovery was _implicit_ in the ICD10 classification system.

### Key Issues with RecSys

- Gathering data for the Utility Matrix
We do not suffer the typical issue with explicit versus implicit "ratings" or intensities or frequencies with our dataset. All our ratings are explicit! The healthcare providers have supplied the assignments/ratings.
- Determination of unknown frequencies from known frequencies
Utility matrices are, in general, rather sparse. This is very true in our case; it is absurd to expect a patient to have conditions that _densely_ span many ICD10 classes. The sparsity of the matrix offers the classic 'cold start' problem.
- Evaluation

TODO: Why aren't we using Latent Factor Based models?

### Note on RecSys Approaches

We have content filtering, collaborative filtering, and matrix factorization/latent factor models, and deep learning models. TODO: Some bullshit intro about these.

### Content filtering

The key ideas here are:

1. You _don't require other users/patients to 'recommend' diseases to this user!_ You just use two things (1) repeat 'interactions' (we cannot use this since we 'flattened' the data to frequencies)
2. You need the _features_ of the items/classes. So think about a matrix with users and songs. It's not enough for content filtering that a user rated a song 5/5. You need information about this item. Was it Country? Electronic? R&B? You need this additional context for the items for content-based filtering. A lot of this stuff needs to be feature engineered _by hand_! _The feature representations of our ICD classes require a lot of domain knowledge and may be laborious_. Sure, we could mine the text descriptions of the ICD10 classes and codes and come up with an automated system, but we cannot verify both our feature space's veracity and completeness. For example, we would take the `I00-I99` class and maybe create a boolean columns for: `Heart`, `Vascular`, `Arteries and Veins` and so on. This is certainly doable (and very exciting to attempt: FUTURE WORK!) but we don't have time.

So we won't use Content Filtering is not because we do not have time; it's _BECAUSE FEATURE-SPACE REPRESENTATION IS MONSTROUSLY DIFFICULT_! That's really the big reason. It's a PITA and requires someone with domain knowledge to verify the feature-representations of the ICD classifications (i.e., and in RecSys-speak, to "build item profiles"). Some other pains of content filtering are listed in the notes below which we can work into the report.

Other notes:

- Content Filtering is good for patients who have a very _unique_ (in this case, _rare_) set of diseases.
- Once we build item profiles (or project the items/classes into Feature Space), explanations are easy to see (e.g. A00-B99 is harder to explain than "liver:False, rare:True, )
- As new diseases or codes are assigned, content filtering, which only relies upon the 'items' or diseases themselves, is able to make predictions immediately (i.e., it avoids the "first-rater problem"[^first-rater]). This is not a particularly useful advantage to us since (a) we believe that the ICD10 system captures a vast variety of diseases and (b) we anticipiate the rate at which diseases are added to the system to be very low (~~TODO: citation needed... how many diseases are added to the ICD system each year?~~) *This year there are 159 new codes, 32 deleted codes, and 20 revised codes – a total of 72,748 codes to choose from.* [source: https://www.experityhealth.com/blog/what-you-need-to-know-about-2022-icd-10-cm-code-changes/#:~:text=This%20year%20there%20are%20159,code%20added%20for%20this%20update.]
- In general, the biggest difficulty of content based filtering is the discovery of features. In our case, a given disease might span multiple ICD classes (TODO: example; autoimmune disorders?). However, it would be stupid of us to come up with a classification scheme that is better than ICD10 and we're assuming that the combination of primary, secondary, and tertiary codes in the patient data captures most of the disease.
- The second problem here is one of overspecialization. Content based filtering has horse blinds on: it simply cannot predict/recommend diseases _outside the user's profile_. In other words, it cannot exploit the health/disease trajectories of _other_ users. This, at least to us, is the most severe deficiency of this approach!
- Content filtering is not immune to the cold-start problem either. While typical recsys solve this problem by assigning an 'average' profile to a user. In our case, there cannot be an average 'disease' assigned (TODO: is there a 'healthy' ICD code we can start with?).

Give an example of what a lookup table would look like for the content-filtering approach using the ICD10 descriptions.

### Collaborative filtering

"You liked X, Y. _People like you_ like Z." This is _content-agnostic_! That's the really important bit. You _only_ use ratings/frequencies to create recommendations and absolutely nothing else! This is a good thing since it avoids the feature representation problems discussed in the Content Filtering approach. _It "just works" for **any** kind of item_ and obviates the need for feature representation and selection.

You find other users _similar_ to the current user and provide recommendations/predictions based on what this "immediate neighbourhood" of users _or_ items. In doing this we are addressing both Use Cases 1 and 2!

It assumes that there is a (hidden for memory-based approaches) generative "force" that explains the 'interactions' between a user and an item/class.

The hard problem here is to find out this "immediate neighbourhood". Between two patients A and B in our pruned dataset, we need a metric that chews the disease class frequency vectors and spits out a continuous real-valued number that denotes _similarity_. Call this $sim(A, B)$.

THis has two approaches:

1. Memory Based: This is just 'model-free'. Use some distance metric and show results.
2. Model Based: TODO: Explain this shit and why we're not doing it (i.e. not using Latent Factor Models)

#### Determining Similarity

> The only difference between the adjusted cosine and Pearson’s correlation is that the Pearson function uses items that two users have rated, while the cosine similarity function uses all rated items by either or both, setting the ratings to zero when one of the users doesn’t rated an item.

#### What kind of Similarity are we looking for? User-User or Item-Item?

Typically, the "neighborhood" of _users_ (patients) consists of people who have _also_ been diagnosed with a disease class. In movie world, we're talking about a subset of users _all of whom have rated the same subset of movies_. This might be useful for Use Case 1. Maybe.

TODO: Amazon has shown that item-item similarity is very efficient for _them_ since they have far more items than users. What about us? Since we are looking for patients with similar "journeys", it might be wise to perform user-user similarity. Maybe tho. What does item-item similarity give us? How do we figure out "diseases that occur together"? That's the whole point of this, yes?

How about this:

- User-User similarity gives us the patients who have "similar journeys" (Use Case 2)
- Item-Item similarity gives us the _disease vectors_ that are similar to each other (Use Case 1)

I think this is right. I hope.

In practice, and generally speaking, _item-item similarity outperforms user-user similarity_. Amazon has shown this (TODO: link to them showing this). Some reasons are

- Typically, items/classes outnumber users. This is definitely true in our case (~100,000 users versus 22/285/1918 ICD classes).
- Items/classes _generally_ have fewer classes/genres than users: we are all complex and snowflaky as much as we'd like to believe to the contrary. As an example from movies: You can highly like/rate _both_ obscure Bengali arthouse cinema _and_ mainstream blockbuster Marvel movies. Mapping this to our case, you can have a 'common' disease (e.g. acid reflux TODO: better example?) _and_ a rare one (e.g. Stargardt Disease TODO: better example?)
- The point above has an inherent assumption and deep implication in the _general_ case: Item similarity is more meaningful than user similarity (again, in the _general_ case!) The idea is that items don't tend to span features too much: Bengali arthouse movies will have very few _features_ in common with Marvel movies. _However_, our situation deals with 'items'/classes that belong to a larger, complex system: the human physiology. Is a chronic earache indicative of cancers of the colon? Most likely not, but our approach just ignores the complicated interactions of a complex system (TODO: provide an example of 'wow'/'dang'/unexpected interactions: nail fungus strongly indicating disorders of the lymphatic system (I made that up)). Content Filtering might be able to capture this but our approach does not.

### Model Evaluation

TODO: We do this by subsetting our Layers 1, 2, and 3 datasets. How simple! We don't subset entire _rows_. We subset rows _and_ columns/codes/classes _together_. We can use simple RMSE here and report things. PROBLEM: We have _very_ sparse matrices. So our errors might be more meaningful with Layer 1 than with Layer 3 (or Layer 4 should be decide to do it).

Note that the RMSE only considers _differences_ and not actual values. In 'typical' RecSys, this is a problem since they are (again, typically) concerned with high ratings. This deficiency does apply to us since we want to be as accurate as possible about predicting the most likely set of diseases/classes. TODO: [Here's an approach](https://medium.com/@m_n_malaeb/recall-and-precision-at-k-for-recommender-systems-618483226c54) we can apply to evaluate our case.

## Conclusions and Future Work

Problem with a memory-based collaborative filtering approach is fundamentally one of complexity. If you wanted to add 100,000 new patients to our model, the addition is an $O(100,000 \times |F|)$ operation given the pairwise recomputations that must occur before it is useful. Locality Sensitive Hashing (LSH) is a commonly used approach to address this problem.

Our approach and evaluation metric will not capture the disease/class prediction _context_, nor will it capture _order_. A patient might visit the Bahamas and contact a fungal disease that is _far_ outside their 'typical' disease journey. Our memory-based model will capture neither this novelty nor progression. Tant pis, c'est la vie you know?

## References

## Appendix

[^cosine]: The actual distance is $\theta$ and not $\cos(theta)$... similarity is actually $180 - theta$ (you want the number to be large for greater similarity!)
[^first-rater]: This happens when there's a new item/disease/ICD code/class. Inapplicable to our case because we're fundamentally assuming that everything is captured in the ICD taxonomy of diseases! 👈👈👈 This is the most important thing!

---

### Misc Notes to be assimilated

- RecSys are not used just for rating! Provide example of Amazon pruchases of baby food/toys/etc.

For Problem 4: WE ARE NOT DEALING WITH ENCOUNTERS! IT'S NOT ENCOUNTERS! USE A DIFFERENT WORD. "CLASS FREQUENCIES" IS OK. DON'T IRRITATE MEDICAL CODERS (LIKE SHREA).

Member and Patient are synonymous for our report. We are decontextualizing a 'member' by just examining disease frequencies.

### Global Baseline Estimate

Recomputation is the _biggest_ PITA with recommender systems in general and is something our solution suffers from as well. Consider that we were not able to provide custom patient profiles because of the computational costs incurred in perturbing the similarity matrix "on the fly". TODO: What do the Big Companies do here?

The most recommended conditions are not necessarily the most _critical_ conditions! We have `weight`

