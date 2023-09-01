"use strict";

var treasuryBalance = document.querySelector('#w-node-_44a7e32b-69c3-9198-75bb-455e2f857790-53111917');
var treasuryHoldersList = document.querySelector('.currency-list');
var proposalList = document.querySelector('.proposal-list');

var fetchTreasuryBalance = function fetchTreasuryBalance() {
  var url, res, data, balance, balanceInEth;
  return regeneratorRuntime.async(function fetchTreasuryBalance$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          url = '/token-balance';
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch(url));

        case 3:
          res = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(res.json());

        case 6:
          data = _context.sent;

          if (data && data.balance !== undefined) {
            balance = data.balance;
            balanceInEth = balance / Math.pow(10, 18);
            treasuryBalance.textContent = balanceInEth;
          } else {
            console.log('Error fetching balance');
          }

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};

var fetchTreasuryHolders = function fetchTreasuryHolders() {
  var url, res, data, desiredSymbols, desiredTokens;
  return regeneratorRuntime.async(function fetchTreasuryHolders$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          url = '/token-holders';
          _context2.next = 3;
          return regeneratorRuntime.awrap(fetch(url));

        case 3:
          res = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(res.json());

        case 6:
          data = _context2.sent;

          if (data && data.length > 0) {
            // Extract tokens with symbols "RH2O", "BTC", and "USDT"
            desiredSymbols = ["RH2O", "BTC", "USDT"];
            desiredTokens = data.filter(function (token) {
              return desiredSymbols.includes(token.symbol);
            });

            if (desiredTokens.length > 0) {
              desiredTokens.forEach(function (token) {
                var symbol = token.symbol,
                    balance = token.balance; // const balanceInEth = balance / 10 ** 18;

                var listItem = document.createElement('div');
                listItem.classList.add('currency-item');
                listItem.innerHTML = "\n                    <div class=\"treasury-card-curency\">\n                        <div class=\"curency-title-wr\">\n                            <div class=\"rounded-rectangle\"></div>\n                            <div class=\"paragraph-medium bold holders\">".concat(symbol, "</div>\n                        </div>\n                        <div class=\"currency-numbers-wr\">\n                            <div class=\"number-wr\">\n                                <p class=\"paragraph-medium\">").concat(balance, "</p>\n                            </div>\n                            <div class=\"number-wr\">\n                                <p class=\"paragraph-medium opacity-04\">$</p>\n                            </div>\n                            <div class=\"number-wr is-last\">\n                                <p class=\"paragraph-medium opacity-04\">%</p>\n                            </div>\n                        </div>\n                    </div>\n                ");
                treasuryHoldersList.appendChild(listItem);
              });
            }
          } else {
            console.log('Error fetching holders');
          }

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var fetchSnapshot = function fetchSnapshot() {
  var url, res, data, apiData, apiData2, resultArray, currentDate;
  return regeneratorRuntime.async(function fetchSnapshot$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          url = '/snapshot-api';
          _context3.next = 3;
          return regeneratorRuntime.awrap(fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          }));

        case 3:
          res = _context3.sent;
          _context3.next = 6;
          return regeneratorRuntime.awrap(res.json());

        case 6:
          data = _context3.sent;
          apiData = data.apiData;
          apiData2 = data.apiData2;
          resultArray = [];
          currentDate = new Date();

          if (apiData && apiData2) {
            apiData.data.proposals.forEach(function (proposal) {
              var proposalObject = {
                title: proposal.title,
                id: proposal.id,
                end: Math.ceil((new Date(proposal.end * 1000) - currentDate) / (1000 * 60 * 60 * 24)),
                state: proposal.state,
                space: {
                  id: proposal.space.id
                }
              };
              var matchingVote = apiData2.data.votes.find(function (vote) {
                return vote.proposal.id === proposal.id;
              });

              if (matchingVote) {
                proposalObject.votes = [{
                  choice: matchingVote.choice
                }];
              }

              resultArray.push(proposalObject);
            });
            console.log(resultArray);
            resultArray.forEach(function (proposal, i) {
              // vote counter
              var yesVotes = 0;
              var noVotes = 0;
              var totalVotes = 0;
              var yesVotePercentage = 0;
              var noVotePercentage = 0;
              var proposalItem = document.createElement('div');
              proposalItem.classList.add('project-card-recent'); // Inner HTML of item

              proposalItem.innerHTML = "\n                <div class=\"recent-pr-content-wr\">\n                    <div class=\"proposal-cat-title-wr\">\n                        <div class=\"category-label paragraph-small\">\n                            <div class=\"paragraph-small\">Governance</div>\n                        </div>\n                        <h4 class=\"heading-size-4\">".concat(proposal.title, "</h4>\n                    </div>\n                    <div class=\"proposal-bot-wr\">\n                        <div class=\"prop-voting-wr\">\n                        </div>\n                        <div class=\"divider projects recent-copy\"></div>\n                            <div class=\"proposal-links-wrapper\">\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            ");
              proposalList.appendChild(proposalItem); // Vote counter

              if (proposal.votes) {
                proposal.votes.forEach(function (vote) {
                  if (vote.choice === 1) {
                    yesVotes++;
                  } else if (vote.choice === 2) {
                    noVotes++;
                  }

                  totalVotes++;
                });
                yesVotePercentage = Math.round(yesVotes / totalVotes * 100).toFixed(2);
                noVotePercentage = Math.round(noVotes / totalVotes * 100).toFixed(2);
              }

              var proposalDomItem = document.querySelectorAll('.project-card-recent')[i]; // Create and find elements

              var propVoting = document.createElement('div');
              var propShowWr = document.createElement('div');
              var previewLink = document.createElement('a');
              var previewVoteLink = document.createElement('a');
              var proposalLinksWrapper = proposalDomItem.querySelector('.proposal-links-wrapper');
              var propVotingWr = proposalDomItem.querySelector('.prop-voting-wr'); // Add classes

              propVoting.classList.add('voting-wr');
              propShowWr.classList.add('proposal-proposal-show-wr');
              previewLink.classList.add('view-proj-link', 'feat', 'w-inline-block');
              previewVoteLink.classList.add('view-proj-link', 'proposal', 'w-inline-block'); // Set body

              propVoting.innerHTML = "\n            <div class=\"proposal-passed-wr\">\n                <div class=\"voting-icon w-embed\">\n                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"\n                    fill=\"none\">\n                        <path\n                            d=\"M8.5 3.5V2M4.56066 4.56066L3.5 3.5M3.48975 8.5H1.98975M2.04938 13C2.5511 18.0533 6.81465 22 12 22C17.5228 22 22 17.5228 22 12C22 6.81465 18.0533 2.5511 13 2.04938M15 10L12.5 14.5034C11.5 16.0034 12 16.0034 8.5 12.5034\"\n                            stroke=\"#FFCD82\" stroke-width=\"2\" stroke-linecap=\"round\"\n                            stroke-linejoin=\"round\">\n                        </path>\n                    </svg>\n                </div>\n                <p class=\"paragraph-medium yellow\">Voting</p>\n            </div>\n            <p class=\"paragraph-medium opacity-04\">Ends in <span class=\"votes-number-span\">".concat(proposal.end, " days</span></p>\n            ");
              propShowWr.innerHTML = "\n                        <div class=\"proposal-result-wr\">\n                            <div class=\"icon-thimbs-up-wr div-block-61 div-block-62 div-block-63 div-block-64\">\n                                <div class=\"w-embed\">\n                                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" height=\"100%\" viewBox=\"0 0 24 24\" fill=\"none\">\n                                        <path\n                                            d=\"M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H17.4262C18.907 22 20.1662 20.9197 20.3914 19.4562L21.4683 12.4562C21.7479 10.6389 20.3418 9 18.5032 9H15C14.4477 9 14 8.55228 14 8V4.46584C14 3.10399 12.896 2 11.5342 2C11.2093 2 10.915 2.1913 10.7831 2.48812L7.26394 10.4061C7.10344 10.7673 6.74532 11 6.35013 11H4C2.89543 11 2 11.8954 2 13Z\"\n                                            stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"\n                                            stroke-linejoin=\"round\">\n                                        </path>\n                                    </svg>\n                                </div>\n                            </div>\n                            <p class=\"paragraph-medium\">Proposal passed</p>\n                        </div>\n                        <div class=\"voting-graph-wr\">\n                            <div class=\"no-indicator\"></div>\n                            <div class=\"yes-indicator\"></div>\n                        </div>\n                        <div class=\"view-more-pr-wr proposal\">\n                            <div class=\"votings-wrapper\">\n                                <div class=\"vote-wr\">\n                                    <p class=\"paragraph-medium green\">Yes <span class=\"votes-number-span\">".concat(yesVotePercentage, "%</span>\n                                    </p>\n                                    <p class=\"paragraph-medium red\">No <span class=\"votes-number-span\">").concat(noVotePercentage, "%</span></p>\n                                </div>\n                                <p class=\"paragraph-medium opacity-04\">Ttl votes <span class=\"votes-number-span\">").concat(totalVotes, "(384% of)</span></p>\n                            </div>\n                        </div>\n                "); // Set the links

              previewLink.href = "https://demo.snapshot.org/#/".concat(proposal.space.id, "/proposal/").concat(proposal.id);
              previewVoteLink.href = "https://demo.snapshot.org/#/".concat(proposal.space.id, "/proposal/").concat(proposal.id);
              previewLink.target = '_blank';
              previewVoteLink.target = '_blank';
              previewLink.innerHTML = "\n                <div class=\"view-project\">Review</div>\n                <img src=\"https://uploads-ssl.webflow.com/63656aa500afee0dd214c391/6399957775ac3e178e529227_arrow-right.svg\" loading=\"lazy\" alt=\"\" class=\"view-arrow\">\n            ";
              previewVoteLink.innerHTML = "\n                <div class=\"view-project\">Review &amp; Vote</div>\n                <img src=\"https://uploads-ssl.webflow.com/63656aa500afee0dd214c391/6399957775ac3e178e529227_arrow-right.svg\" loading=\"lazy\" alt=\"\" class=\"view-arrow\">\n            "; // Append elements

              if (proposal.state === 'closed') {
                proposalLinksWrapper.appendChild(previewLink);
                propVotingWr.appendChild(propShowWr);
              } else {
                proposalLinksWrapper.appendChild(previewVoteLink);
                propVotingWr.appendChild(propVoting);
              } // State for passed or failed proposals


              var proposalResultWr = document.querySelector('.proposal-result-wr'),
                  proposalResultIcon = document.querySelector('.icon-thimbs-up-wr'),
                  proposalResultText = document.querySelector('.paragraph-medium'),
                  yesIndicator = document.querySelector('.yes-indicator'),
                  noIndicator = document.querySelector('.no-indicator'); // Set the state

              if (yesVotePercentage > noVotePercentage) {
                proposalResultWr.classList.remove('is--failed');
                proposalResultIcon.classList.remove('is--failed');
                proposalResultText.textContent = 'Proposal passed';
              } else {
                proposalResultWr.classList.add('failed');
                proposalResultIcon.classList.add('failed');
                proposalResultText.textContent = 'Proposal failed';
              } // Set the width of the indicators


              yesIndicator.style.width = "".concat(yesVotePercentage, "%");
              noIndicator.style.width = "".concat(noVotePercentage, "%");
            });
          } else {
            console.log('Error fetching snapshot');
          }

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  });
};

if (treasuryBalance && treasuryHoldersList) {
  fetchTreasuryBalance();
  fetchTreasuryHolders();
}

if (proposalList) {
  fetchSnapshot();
}