---
title: Cryptocurrency Integration and Technical Documentation
description: Complete technical guide for cryptocurrency donations, wallet integration, and blockchain implementation on Give Protocol
permalink: /technical/cryptocurrencies/
---

# Supported Cryptocurrencies

## Overview

Give Protocol v1 launch works with cryptocurrencies that meet community-established criteria for security, liquidity, and utility. This ensures charitable organizations can reliably receive and utilize donations while protecting all stakeholders from unnecessary risks.

## Governance Framework

### Current Implementation

During our initial phase, the Give Protocol core team maintains the supported token list based on the criteria outlined below. All decisions are made transparently with documented rationale.

### Future Governance

As Give Protocol matures, token additions and removals will transition to community governance through:

- **Proposal submission**: Any community member can propose new tokens that meet minimum criteria
- **Technical review**: Automated verification of objective metrics (liquidity, security, etc.)
- **Community discussion**: Public forum for stakeholder input
- **Voting period**: Multi-stakeholder voting including donors, verified charities, and protocol contributors
- **Implementation**: Successful proposals automatically trigger technical integration

## Minimum Criteria for Token Support

All tokens must meet these objective, verifiable criteria to be eligible for community consideration:

### 1. Liquidity Requirements

- **24-hour trading volume**: Minimum $10 million USD across verified exchanges
- **Active trading pairs**: Direct fiat (USD/EUR) or major stablecoin pairs required
- **Market depth**: Must handle $50,000 conversions with <2% slippage
- **Exchange availability**: Listed on 3+ reputable exchanges with charity-friendly policies

**Rationale**: Ensures charities can convert donations without significant loss or delay

### 2. Technical Standards

- **Moonbeam compatibility**: Full ERC-20 standard or native token support
- **Security history**: No known vulnerabilities or history of exploits in token contracts

**Rationale**: Protects donation integrity and ensures smooth platform operations

### 3. Accessibility Metrics

- **Off-ramp availability**: Documented paths to USD/EUR via compliant providers
- **Wallet support**: Integration with MetaMask and/or Polkadot.js
- **Regulatory status**: No active enforcement actions in G20 jurisdictions

**Rationale**: Ensures charities can actually access and use donated funds

### 4. Risk Parameters

**Volatility limits**:

- Stablecoins: <2% deviation from peg (95% of time)
- Native tokens: <50% 30-day volatility

**Audit requirements**: Published security audits (stablecoins need reserve attestations)

**Concentration limits**: No single holder controls >30% of supply

**Age requirement**: 12+ months since token launch

**Rationale**: Protects charities from extreme volatility and technical risks

## Currently Supported Cryptocurrencies

The following tokens have been verified to meet all criteria and are actively supported:

### GLMR (Glimmer)

**Classification**: Platform native token

- **Charity benefits**: Lowest transaction costs on Moonbeam, direct ecosystem support
- **Donor benefits**: Native integration, no bridge risks

### DOT (Polkadot)

**Classification**: Ecosystem native token

- **Charity benefits**: Deep liquidity, institutional-grade infrastructure
- **Donor benefits**: Wide exchange support, proven security

### USDC (USD Coin)

**Classification**: Regulated stablecoin

- **Key metrics**: <0.5% deviation from peg, Circle attestations
- **Charity benefits**: Direct USD redemption, regulatory clarity
- **Donor benefits**: No volatility risk, wide acceptance

**Governance note**: Meets all stability criteria with significant margin

### USDT (Tether)

**Classification**: Stablecoin

- **Key metrics**: Highest stablecoin liquidity globally
- **Charity benefits**: Universal exchange support, global accessibility
- **Donor benefits**: Minimal slippage on large donations
