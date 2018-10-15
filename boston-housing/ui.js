/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import renderChart from 'vega-embed';

import {linearRegressionModel, multiLayerPerceptronRegressionModel1Hidden, multiLayerPerceptronRegressionModel2Hidden, run} from '.';

const statusElement = document.getElementById('status');
export const updateStatus = (message) => {
  statusElement.value = message;
};

const baselineStatusElement = document.getElementById('baselineStatus');
export const updateBaselineStatus = (message) => {
  baselineStatusElement.value = message;
};

const weightsElement = document.getElementById('weightsTextArea');
/**
 * Updates the weights output area to include information about the weights
 * learned in a simple linear model.
 * @param {List} weightsList list of objects with 'value':number and 'description':string
 */
export const updateWeights = (weightsList) => {
  let message = 'Weights are fun: \n\n';
  for (let v of weightsList) {
    message += `${v.description} : ${v.value.toFixed(4)}\n`
  }
  weightsElement.value = message;
};

export const setup = async () => {
  const trainSimpleLinearRegression = document.getElementById('simple-mlr');
  const trainNeuralNetworkLinearRegression1Hidden =
      document.getElementById('nn-mlr-1hidden');
  const trainNeuralNetworkLinearRegression2Hidden =
      document.getElementById('nn-mlr-2hidden');

  trainSimpleLinearRegression.addEventListener('click', async (e) => {
    const model = linearRegressionModel();
    losses = [];
    await run(model, true);
  }, false);

  trainNeuralNetworkLinearRegression1Hidden.addEventListener(
      'click', async () => {
        const model = multiLayerPerceptronRegressionModel1Hidden();
        losses = [];
        await run(model, false);
      }, false);

  trainNeuralNetworkLinearRegression2Hidden.addEventListener(
      'click', async () => {
        const model = multiLayerPerceptronRegressionModel2Hidden();
        losses = [];
        await run(model, false);
      }, false);
};

let losses = [];
export const plotData = async (epoch, trainLoss, valLoss) => {
  losses.push({'epoch': epoch, 'loss': trainLoss, 'split': 'Train Loss'});
  losses.push({'epoch': epoch, 'loss': valLoss, 'split': 'Validation Loss'});

  const spec = {
    '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
    'width': 250,
    'height': 250,
    'data': {'values': losses},
    'mark': 'line',
    'encoding': {
      'x': {'field': 'epoch', 'type': 'quantitative'},
      'y': {'field': 'loss', 'type': 'quantitative'},
      'color': {'field': 'split', 'type': 'nominal'}
    }
  };

  return renderChart('#plot', spec, {actions: false});
}
