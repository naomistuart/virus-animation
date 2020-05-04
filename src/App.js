import React from 'react';
import './App.css';
import Grid from './Components/Grid';
import NonRandomGrid from './Components/NonRandomGrid';
import Container from '@material-ui/core/Container';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import useMediaQuery from '@material-ui/core/useMediaQuery';


function App() {
      return (
            <Container maxWidth='sm'>
                  <h1>Animating the Spread of a Virus</h1>

                  <p>Recently one of my colleagues posted on our team chat some <a href="https://meltingasphalt.com/interactive/outbreak/">cool animations</a> he came across. That webpage, by <a href="https://meltingasphalt.com/about/">Kevin Simler</a>, is an interactive essay with playable simulations of a disease outbreak.</p>

                  <p>I found the animations elegant and endlessly fascinating. And since I was in the beginning phases of learning JavaScript and React, I thought it would be a good learning opportunity for me to recreate some of those interactive visuals from scratch.</p>

                  <p><strong>The goal of this project is to visualise, and hence develop intuition for, a simplified process for disease outbreak.</strong> My interest in this topic was obviously sparked in part by these coronavirus times, but the following animations were developed to model a general outbreak process, not that of any particular disease or virus.</p>

                  <h2>Population</h2>

                  <p>For a virus to spread, we first need a <strong>population</strong>.</p>

                  <p>In these animations, we represent the population as a grid. Each square, or node, in the grid represents one person in the population.</p>

                  <p>The following grid models a population of 25 people. The person in the center is <span className='infected label'><strong>infected</strong></span>. All other individuals are <span className='susceptible label'><strong>susceptible</strong></span>, meaning they are not currently infected, but are at risk of becoming so.</p>

                  <Grid nodeDimension={25}
                        gridDimension={5}
                        infectionRate={0.13}
                        deathRate={0.08}
                        stepsToRecovery={4}
                        stepsToDeath={10}
                        animationSpeed={1}
                        startWithSingleInfectedNode={true}
                        showInfectionRateSlider={false}
                        showDeathRateSlider={false}
                        showStepsToRecoverySlider={false}
                        showStepsToDeathSlider={false}
                        showPlaybackControls={false}
                  />

                  <h2>Transmission</h2>

                  <p>The virus spreads when an infected person <strong>transmits</strong> the disease to a susceptible person.</p>

                  <p>We define the <strong>transmission rate</strong> as the probability that a susceptible individual acquires the disease from its infected neighbour.</p>

                  <p>Click the <PlayArrowIcon className='playIcon' /> button to see how the disease spreads through the population!</p>

                  <Grid nodeDimension={useMediaQuery('(min-width:600px)', {noSsr:true}) ? 11 : 6}
                        gridDimension={35}
                        infectionRate={0.4}
                        deathRate={0}
                        stepsToRecovery={1}
                        stepsToDeath={10}
                        animationSpeed={50}
                        startWithSingleInfectedNode={true}
                        showInfectionRateSlider={true}
                        showDeathRateSlider={false}
                        showStepsToRecoverySlider={false}
                        showStepsToDeathSlider={false}
                        showPlaybackControls={true}
                  />

                  <p>In this model, infected individuals eventually become <span className='recovered label'><strong>recovered</strong></span>. Once recovered, they acquire immunity to the disease, meaning they can neither catch the disease again, nor continue infecting others.</p>

                  <h3>Varying the transmission rate</h3>

                  <p>Playing with the slider above yields the following observations:</p>
                  <ul>
                        <li>A transmission rate of 0% means the virus does not spread at all. The only person infected is the <a href="https://en.wikipedia.org/wiki/Index_case">index case</a> in the middle.</li>
                        <li>For transmission rates below around 35%, the disease almost always fizzles out before reaching all four corners of the grid.</li>
                        <li>Above this threshold, the infection spreads throughout the population and usually infects almost everyone.</li>
                  </ul>

                  <h3>How does the transmission rate work?</h3>

                  <p>In our grid model, each individual has <strong>four</strong> neighbours from which it could potentially catch the disease (top, bottom, left and right - diagonal neighbours are not counted).</p>

                  <p>The probability that an individual becomes infected depends not only on the transmission rate, but also on the <strong>number of infected neighbours</strong>.</p>

                  <p>In the example below, the node marked <span className='susceptible node'>?</span> has two infected neighbours, marked <span className='infected node'>1</span> and <span className='infected node'>2</span>. Say the transmission rate is 40%. What is the probability that <span className='susceptible node'>?</span> becomes infected?</p>

                  <NonRandomGrid nodeDimension={25}
                        gridDimension={5}
                        infectedNodes={[7, 11, 12, 13, 16]}
                        starredNodes={[17]}
                        numberedNodes={[12, 16]}
                  />

                  <p>It is, in fact, easier to first calculate the probability that <span className='susceptible'>?</span> does <em>not</em> become infected.</p>

                  <p>For each neighbour, the probability that <span className='susceptible node'>?</span> does not become infected is <code>1 - transmission_rate = 1 - 0.4 = 0.6</code>. Since there are two infected neighbours, the probability that <span className='susceptible node'>?</span> becomes infected by <em>neither</em> neighbour is <code>(1 - transmission_rate)&sup2; = (1 - 0.4)&sup2; = 0.36</code>.</p>

                  <p>If the probability that <span className='susceptible node'>?</span> does not become infected is <code>0.36</code>, this means the probability that it <em>does</em> become infected must be <code>1 - 0.36 = 0.64</code>.</p>

                  <p>To generalise, the <strong>probability that an individual becomes infected</strong> at a particular time step can be calculated as follows:</p>

                  <code>1 - (1 - transmission_rate)<sup>num_infected_neighbours</sup></code>

                  <h2>Death</h2>
                  <p>So far we have assumed all infected individuals eventually recover. Unfortunately this is not the case in real life, where some infected people end up <span className='dead label'><strong>dead</strong></span>.</p>

                  <p>Try varying the death rate in this next iteration of the model to see how the population fares.</p>

                  <Grid nodeDimension={useMediaQuery('(min-width:600px)', {noSsr:true}) ? 11 : 6}
                        gridDimension={35}
                        infectionRate={0.4}
                        deathRate={0.05}
                        stepsToRecovery={1}
                        stepsToDeath={1}
                        animationSpeed={50}
                        startWithSingleInfectedNode={true}
                        showInfectionRateSlider={true}
                        showDeathRateSlider={true}
                        showStepsToRecoverySlider={false}
                        showStepsToDeathSlider={false}
                        showPlaybackControls={true}
                  />

                  <h2>Time to Recovery or Death</h2>

                  <p>Once a person becomes infected, how long does it take for them to either recover or die? In our previous models, we made the simplifying assumption that it takes one day, or <strong>one step of the animation</strong>. (Try using the <strong>STEP</strong> button on previous models to confirm this!)</p>

                  <p>In reality, however, it likely takes a bit longer than a day. In this model, we add sliders to vary the time from infection to recovery, and the time from infection to death.</p>

                  <Grid nodeDimension={useMediaQuery('(min-width:600px)', {noSsr:true}) ? 11 : 6}
                        gridDimension={35}
                        infectionRate={0.4}
                        deathRate={0.05}
                        stepsToRecovery={4}
                        stepsToDeath={10}
                        animationSpeed={50}
                        startWithSingleInfectedNode={true}
                        showInfectionRateSlider={true}
                        showDeathRateSlider={true}
                        showStepsToRecoverySlider={true}
                        showStepsToDeathSlider={true}
                        showPlaybackControls={true}
                  />

                  <h3>Varying the time to recovery / death</h3>

                  <p>What's the first thing you notice?</p>

                  <p>With the transmission rate kept at 40%, the virus now affects the whole population with almost complete certainty. Contrast this with earlier models, where a 40% transmission rate usually spared a small number of individuals in the population, who remain unaffected.</p>

                  <p>The logic is intuitive. If a person takes longer to recover or die, it means they <strong>remain infectious for a longer period of time</strong>, during which they have the opportunity to infect a greater number of people.</p>

                  <h3>Limitations</h3>

                  <p>Of course, this is not completely realistic. Given an individual is aware they are infected (i.e. they are not an asymptomatic silent carrier), one would assume (or hope) that they would be self-isolating, or quarantined in hospital. In this case, they would cease to infect others.</p>

                  <p>A more refined model could explore the effects of isolation and social distancing.</p>

                  <h2>Complete Model</h2>
                  <p>Here is the full model with all sliders included.</p>

                  <p>As a reminder, here are the possible states:</p>

                  <p><span className='susceptible label'><strong>Susceptible</strong></span> | <span className='infected label'><strong>Infected</strong></span> | <span className='recovered label'><strong>Recovered</strong></span> | <span className='dead label'><strong>Dead</strong></span></p>

                  <Grid nodeDimension={useMediaQuery('(min-width:600px)', {noSsr:true}) ? 11 : 6}
                        gridDimension={45}
                        infectionRate={0.4}
                        deathRate={0.05}
                        stepsToRecovery={4}
                        stepsToDeath={10}
                        animationSpeed={1}
                        startWithSingleInfectedNode={true}
                        showInfectionRateSlider={true}
                        showDeathRateSlider={true}
                        showStepsToRecoverySlider={true}
                        showStepsToDeathSlider={true}
                        showPlaybackControls={true}
                  />

                  <div className='EndSpacer'></div>
            </Container>
      )
}

export default App;
