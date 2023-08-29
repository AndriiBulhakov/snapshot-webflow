const proposalList = document.getElementById('proposal-list');
fetch('https://testnet.snapshot.org/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
        query Proposals {
            proposals(
              first: 20,
              skip: 0,
              where: {
                space_in: ["wdtest2.eth"],
                state: "closed"
              },
              orderBy: "created",
              orderDirection: desc
            ) {
              id
              title
              body
              choices
              start
              end
              snapshot
              state
              author
              space {
                id
                name
              }
            }
        }
        `
        }),
    })
    .then(res => res.json())
    .then(data => {
        data.data.proposals.forEach(proposal => {
            fetch('https://hub.snapshot.org/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            query Votes {
                                votes(
                                    first: 1000,
                                    skip: 0,
                                    where: {
                                        proposal: "${proposal.id}"
                                    }
                                ) {
                                    id
                                    voter
                                    created
                                    choice
                                    space {
                                        id
                                        name
                                    }
                                }
                            }
                        `
                    }),
                })
                .then(res => res.json())
                .then(data => {
                    let yesVotes = 0;
                    let noVotes = 0;
                    let totalVotes = 0;
                    data.data.votes.forEach(vote => {
                        if (vote.choice === '1') {
                            yesVotes++;
                        } else if (vote.choice === '2') {
                            noVotes++;
                        }
                        totalVotes++;
                    })

                    // Creating item
                    const proposalItem = document.createElement('div');

                    // Add class for item
                    proposalItem.classList.add('project-card-recent');

                    // Inner HTML of item
                    proposalItem.innerHTML = `
                        <div class="recent-pr-content-wr">
                            <div class="proposal-cat-title-wr">
                                <div class="category-label paragraph-small">
                                    <div class="paragraph-small">Governance</div>
                                </div>
                                <h4 class="heading-size-4">${proposal.title}</h4>
                            </div>
                            <div class="proposal-bot-wr">
                                <div class="prop-voting-wr">
                                </div>
                                <div class="divider projects recent-copy"></div>
                                    <div class="proposal-links-wrapper">
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    proposalList.appendChild(proposalItem);

                    // Calculate percentages
                    let yesPercentage = (yesVotes / totalVotes) * 100;
                    let noPercentage = (noVotes / totalVotes) * 100;

                    // Format the percentages with two decimal places
                    let formattedYesPercentage = yesPercentage.toFixed(2);
                    let formattedNoPercentage = noPercentage.toFixed(2);

                    // Converte dates
                    const endTimestamp = proposal.end;
                    const currentDate = new Date();
                    const endDate = new Date(endTimestamp * 1000);

                    // Calculate the time difference in milliseconds
                    const timeDifference = endDate - currentDate;

                    // Convert milliseconds to days
                    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

                    // Create and find elements
                    const propVoting = document.createElement('div');
                    const propShowWr = document.createElement('div');
                    const previewLink = document.createElement('a');
                    const previewVoteLink = document.createElement('a');
                    const proposalLinksWrapper = document.querySelector('.proposal-links-wrapper');
                    const propVotingWr = document.querySelector('.prop-voting-wr');

                    // Add classes
                    propVoting.classList.add('voting-wr');
                    propShowWr.classList.add('proposal-proposal-show-wr');
                    previewLink.classList.add('view-proj-link', 'feat', 'w-inline-block');
                    previewVoteLink.classList.add('view-proj-link', 'proposal', 'w-inline-block');


                    // Set body
                    propVoting.innerHTML = `
                        <div class="proposal-passed-wr">
                            <div class="voting-icon w-embed">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none">
                                    <path
                                        d="M8.5 3.5V2M4.56066 4.56066L3.5 3.5M3.48975 8.5H1.98975M2.04938 13C2.5511 18.0533 6.81465 22 12 22C17.5228 22 22 17.5228 22 12C22 6.81465 18.0533 2.5511 13 2.04938M15 10L12.5 14.5034C11.5 16.0034 12 16.0034 8.5 12.5034"
                                        stroke="#FFCD82" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                    </path>
                                </svg>
                            </div>
                            <p class="paragraph-medium yellow">Voting</p>
                        </div>
                        <p class="paragraph-medium opacity-04">Ends in <span class="votes-number-span">${daysLeft} days</span></p>
                    `;

                    propShowWr.innerHTML = `
                        <div class="proposal-result-wr">
                            <div class="icon-thimbs-up-wr div-block-61 div-block-62 div-block-63 div-block-64">
                                <div class="w-embed">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H17.4262C18.907 22 20.1662 20.9197 20.3914 19.4562L21.4683 12.4562C21.7479 10.6389 20.3418 9 18.5032 9H15C14.4477 9 14 8.55228 14 8V4.46584C14 3.10399 12.896 2 11.5342 2C11.2093 2 10.915 2.1913 10.7831 2.48812L7.26394 10.4061C7.10344 10.7673 6.74532 11 6.35013 11H4C2.89543 11 2 11.8954 2 13Z"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                        </path>
                                    </svg>
                                </div>
                            </div>
                            <p class="paragraph-medium">Proposal passed</p>
                        </div>
                        <div class="voting-graph-wr">
                            <div class="no-indicator"></div>
                            <div class="yes-indicator"></div>
                        </div>
                        <div class="view-more-pr-wr proposal">
                            <div class="votings-wrapper">
                                <div class="vote-wr">
                                    <p class="paragraph-medium green">Yes <span class="votes-number-span">${formattedYesPercentage}%</span>
                                    </p>
                                    <p class="paragraph-medium red">No <span class="votes-number-span">${formattedNoPercentage}%</span></p>
                                </div>
                                <p class="paragraph-medium opacity-04">Ttl votes <span class="votes-number-span">${totalVotes}(384% of)</span></p>
                            </div>
                        </div>
                    `;

                    // Set the links
                    previewLink.href = `https://demo.snapshot.org/#/${proposal.space.id}/proposal/${proposal.id}`;
                    previewVoteLink.href = `https://demo.snapshot.org/#/${proposal.space.id}/proposal/${proposal.id}`;

                    previewLink.target = '_blank';
                    previewVoteLink.target = '_blank';

                    previewLink.innerHTML = `
                        <div class="view-project">Review</div>
                        <img src="https://uploads-ssl.webflow.com/63656aa500afee0dd214c391/6399957775ac3e178e529227_arrow-right.svg" loading="lazy" alt="" class="view-arrow">
                    `;
                    previewVoteLink.innerHTML = `
                        <div class="view-project">Review &amp; Vote</div>
                        <img src="https://uploads-ssl.webflow.com/63656aa500afee0dd214c391/6399957775ac3e178e529227_arrow-right.svg" loading="lazy" alt="" class="view-arrow">
                    `;

                    // Append elements
                    if(proposal.state === 'closed') {
                        proposalLinksWrapper.appendChild(previewLink);
                        propVotingWr.appendChild(propShowWr);
                    } else {
                        proposalLinksWrapper.appendChild(previewVoteLink);
                        propVotingWr.appendChild(propVoting);
                    }

                    // State for passed or failed proposals
                    const proposalResultWr = document.querySelector('.proposal-result-wr'),
                          proposalResultIcon = document.querySelector('.icon-thimbs-up-wr'),
                          proposalResultText = document.querySelector('.paragraph-medium'),
                          yesIndicator = document.querySelector('.yes-indicator'),
                          noIndicator = document.querySelector('.no-indicator');

                    // Set the state
                    if(yesPercentage > noPercentage) {
                        proposalResultWr.classList.remove('is--failed');
                        proposalResultIcon.classList.remove('is--failed');
                        proposalResultText.textContent = 'Proposal passed';
                    } else {
                        proposalResultWr.classList.add('failed');
                        proposalResultIcon.classList.add('failed');
                        proposalResultText.textContent = 'Proposal failed';
                    }

                    // Set the width of the indicators
                    yesIndicator.style.width = `${yesPercentage}%`;
                    noIndicator.style.width = `${noPercentage}%`;
                })
        });
    })