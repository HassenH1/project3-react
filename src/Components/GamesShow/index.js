import React, { Component } from "react"

import GameDetails from '../GameDetails'
import ReviewForm from "../ReviewForm"
import ReviewList from '../ReviewList'

import { css } from '@emotion/core';
import { withRouter } from "react-router-dom"
import BarLoader from 'react-spinners/BarLoader';
import { Container1 } from "./style"


const override = css`
    display: block;
    margin: 15% auto;
`;

class GamesShow extends Component {
    state = {
        shownGame: {},
        foundReviews: [],
        loadingGame: true,
        loadingReviews: true
    }
    componentDidMount() {
        this.getOneGame();
        this.getReviews();
    }
    getOneGame = async () => {
        try {
            const gameResponse = await (await fetch(`${process.env.REACT_APP_API_URL}/api/v1/games/appid/${this.props.match.params.id}`, {
                method: "GET",
                credentials: "include"
            })).json();
            console.log(gameResponse)
            this.setState({
                shownGame: gameResponse,
                loadingGame: false
            })
        } catch(err) {
            console.log(err)
        }
    }

    getReviews = async () => {
        const reviewResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/reviews/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            } 
        })
        const parsedReviews = await reviewResponse.json()
        this.setState({
            foundReviews: parsedReviews.data,
            loadingReviews: false
        })
        console.log(parsedReviews.data)
    }   

    deleteReview = async (id) => {
        const deletedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/reviews/${id}`, {
            method: 'DELETE',
        });
        const parsedResponse = await deletedResponse.json();
        console.log(parsedResponse)
        this.setState({
            foundReviews: this.state.foundReviews.filter(review => review.id !== id)
        })
    }

    render() {
        return (
            this.state.loadingGame || this.state.loadingReviews
                ? <BarLoader
                    css={override}
                    sizeUnit={"px"}
                    size={150}
                    color={'#7a7a7a'}
                  />
                : <Container1>
                    <GameDetails shownGame={this.state.shownGame} />
                    {this.props.currentUser.username ? <ReviewForm currentUser={this.props.currentUser} /> : ""}
                    <ReviewList foundReviews={this.state.foundReviews} currentUser={this.props.currentUser} gameId={this.props.match.params.id} deleteReview={this.deleteReview}/>
                </Container1>
            
        )
    }
}

export default withRouter(GamesShow)