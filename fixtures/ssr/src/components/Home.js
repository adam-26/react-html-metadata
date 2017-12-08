import React, {Component} from 'react';
import { withMetadata } from 'react-html-metadata';

class Home extends Component {

  static getMetadata(/*match, props*/) {
    return {
      title: 'Homepage Title'
    };
  }

  render() {
    return (
      <div>
        <h1>Welcome</h1>
      </div>
    );
  }
}

export default withMetadata()(Home);
