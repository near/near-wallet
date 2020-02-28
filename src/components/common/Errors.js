import React from 'react'
import { Button, Divider } from 'semantic-ui-react'

export class Error extends React.Component {
    getErrorText() {
        return 'An unexpected error occurred'
    }

    goBack = () => {
        this.props.history.go(-2)
    }

    render() {
        return (
            <section className='App-section'>
                <div className='App-error-message'>
                    <h2>
                        {this.getErrorText()}
                        <Divider />
                    </h2>
                    <Button onClick={this.goBack} content='Go back' />
                </div>
            </section>
        )
    }
}

export class NotFound extends Error {
    goBack = () => {
        this.props.history.go(-2)
    }

    getErrorText() {
        return 'Not Found'
    }
}
