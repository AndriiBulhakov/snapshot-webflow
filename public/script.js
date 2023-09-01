const treasuryBalance = document.querySelector('#w-node-_44a7e32b-69c3-9198-75bb-455e2f857790-53111917');
const treasuryHoldersList = document.querySelector('.currency-list');
const proposalList = document.querySelector('.proposal-list');

const fetchTreasuryBalance = async () => {
    const url = '/token-balance';
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.balance !== undefined) {
        const { balance } = data;
        const balanceInEth = balance / 10 ** 18;
        treasuryBalance.textContent = balanceInEth;
    } else {
        console.log('Error fetching balance');
    }
};

const fetchTreasuryHolders = async () => {
    const url = '/token-holders';
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.length > 0) {
        // Extract tokens with symbols "RH2O", "BTC", and "USDT"
        const desiredSymbols = ["RH2O", "BTC", "USDT"];
        const desiredTokens = data.filter(token => desiredSymbols.includes(token.symbol));

        if(desiredTokens.length > 0) {
            desiredTokens.forEach(token => {
                const { symbol, balance } = token;
                // const balanceInEth = balance / 10 ** 18;
                const listItem = document.createElement('div');
                listItem.classList.add('currency-item');
                listItem.innerHTML = `
                    <div class="treasury-card-curency">
                        <div class="curency-title-wr">
                            <div class="rounded-rectangle"></div>
                            <div class="paragraph-medium bold holders">${symbol}</div>
                        </div>
                        <div class="currency-numbers-wr">
                            <div class="number-wr">
                                <p class="paragraph-medium">${balance}</p>
                            </div>
                            <div class="number-wr">
                                <p class="paragraph-medium opacity-04">$</p>
                            </div>
                            <div class="number-wr is-last">
                                <p class="paragraph-medium opacity-04">%</p>
                            </div>
                        </div>
                    </div>
                `;
                treasuryHoldersList.appendChild(listItem);
            });
        }
    } else {
        console.log('Error fetching holders');
    }
};

const fetchSnapshot = async () => {
    const url = '/snapshot-api';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await res.json();

    const apiData = data.apiData;
    const apiData2 = data.apiData2;
    const resultArray = [];
    const currentDate = new Date();

    if (apiData && apiData2) {
        apiData.data.proposals.forEach(proposal => {
            const proposalObject = {
              title: proposal.title,
              id: proposal.id,
              end: Math.ceil((new Date(proposal.end * 1000) - currentDate) / (1000 * 60 * 60 * 24)),
              state: proposal.state,
              space: {
                id: proposal.space.id
              }
            };
          
            const matchingVote = apiData2.data.votes.find(vote => vote.proposal.id === proposal.id);
          
            if (matchingVote) {
              proposalObject.votes = [{
                choice: matchingVote.choice
              }];
            }
            resultArray.push(proposalObject);
        });

        console.log(resultArray);

        resultArray.forEach((proposal, i) => {
            // vote counter
            let yesVotes = 0;
            let noVotes = 0;
            let totalVotes = 0;
            let yesVotePercentage = 0;
            let noVotePercentage = 0;

            const proposalItem = document.createElement('div');
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

            // Vote counter
            if (proposal.votes) {
                proposal.votes.forEach(vote => {
                    if (vote.choice === 1) {
                        yesVotes++;
                    } else if (vote.choice === 2) {
                        noVotes++;
                    }
                    totalVotes++;
                });

                yesVotePercentage = Math.round((yesVotes / totalVotes) * 100).toFixed(2);
                noVotePercentage = Math.round((noVotes / totalVotes) * 100).toFixed(2);
            }

            let proposalDomItem = document.querySelectorAll('.project-card-recent')[i];
            // Create and find elements
            const propVoting = document.createElement('div');
            const propShowWr = document.createElement('div');
            const previewLink = document.createElement('a');
            const previewVoteLink = document.createElement('a');
            const proposalLinksWrapper = proposalDomItem.querySelector('.proposal-links-wrapper');
            const propVotingWr = proposalDomItem.querySelector('.prop-voting-wr');

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
            <p class="paragraph-medium opacity-04">Ends in <span class="votes-number-span">${proposal.end} days</span></p>
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
                                    <p class="paragraph-medium green">Yes <span class="votes-number-span">${yesVotePercentage}%</span>
                                    </p>
                                    <p class="paragraph-medium red">No <span class="votes-number-span">${noVotePercentage}%</span></p>
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
            if(yesVotePercentage > noVotePercentage) {
                proposalResultWr.classList.remove('is--failed');
                proposalResultIcon.classList.remove('is--failed');
                proposalResultText.textContent = 'Proposal passed';
            } else {
                proposalResultWr.classList.add('failed');
                proposalResultIcon.classList.add('failed');
                proposalResultText.textContent = 'Proposal failed';
            }

            // Set the width of the indicators
            yesIndicator.style.width = `${yesVotePercentage}%`;
            noIndicator.style.width = `${noVotePercentage}%`;
        });

    } else {
        console.log('Error fetching snapshot');
    }
};

if(treasuryBalance && treasuryHoldersList) {
    fetchTreasuryBalance();
    fetchTreasuryHolders();
}

if(proposalList){
    fetchSnapshot();
}
