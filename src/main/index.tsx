import React, { Component, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { styles } from './styles';



export const Dimesion = {
    width: 350,
    height: 790,
}

const { width, height } = Dimesion;


const GRID_SIZE = 20;
const CELL_SIZE = width / GRID_SIZE;
const HEIGTH_SIZE = height / GRID_SIZE;

interface SnakeSegment {
    x: number;
    y: number;
}

interface Level {
    currentLevel: number;
}

interface SnakeGameState {
    snake: SnakeSegment[];
    food: SnakeSegment;
    isGameRunning: boolean;
    direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
    score: number;
    level: number;
    speed: number;
}


class SnakeGame extends Component<{}, SnakeGameState> {
    private moveInterval: NodeJS.Timeout | undefined;
    private sound: Audio.Sound | undefined;
    private eatSound: Audio.Sound | undefined;
    private deadSound: Audio.Sound | undefined;

    snakeSpeed = {
        level1: 300,
        level2: 150,
        level3: 100,
        level4: 80,
        level5: 50
    }

    handleEatApple = async () => {
        // Lógica para quando a cobra come a maçã

        // Reproduza o som de comer maçã quando a cobra come a maçã
        if (this.eatSound) {
            await this.eatSound.replayAsync();
        }
    }
    generateFoodPosition = (): SnakeSegment => {
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);
        return { x, y };
    };
    state: SnakeGameState = {
        snake: [{ x: 5, y: 5 }],
        food: this.generateFoodPosition(),
        isGameRunning: false,
        direction: 'UP',
        score: 0,
        level: 300,
        speed: 1
    };




    componentWillUnmount() {
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
        }

        if (this.sound) {
            this.sound.unloadAsync();
        }
        if (this.eatSound) {
            this.eatSound.unloadAsync();
        }


    }
    handleSnakeDeath = () => {
        // Lógica para tratar a morte da cobra
        console.log('A cobra morreu! Game Over.');

        // Reproduza o som de morte da cobra
        if (this.deadSound) {
            this.deadSound.replayAsync();
        }
        // Pare o intervalo de movimento
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
        }

        // Reinicializar o estado do jogo
        this.setState({
            snake: [],
            food: this.generateFoodPosition(),
            direction: 'UP',
            score: 0,
            level: this.snakeSpeed.level1,
            speed: 1,
            isGameRunning: false,
        });
    };


    moveSnake = async () => {

        if (this.state.isGameRunning === true) {
            const { snake, direction, food, score } = this.state;


            // Se a cobra estiver morta, não execute a lógica de movimento
            if (this.state.snake.length === 0) {
                return;
            }

            const newSnake = [...snake];
            const head = { ...newSnake[0] };

            switch (direction) {
                case 'UP':
                    head.y = (head.y - 1 + 26) % 26;
                    console.log(head.y);

                    break;
                case 'DOWN':
                    head.y = (head.y + 1) % 26;
                    break;
                case 'LEFT':
                    head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
                    break;
                case 'RIGHT':
                    head.x = (head.x + 1) % GRID_SIZE;
                    break;
            }

            if (this.state.score <= 500) {


                this.setState({
                    level: this.snakeSpeed.level1,
                    speed: 1
                })
            }
            if (this.state.score >= 500 && this.state.score < 1000) {
                this.setState({
                    level: this.snakeSpeed.level2,
                    speed: 2
                })

            }
            if (this.state.score >= 1000 && this.state.score < 2000) {
                this.setState({
                    level: this.snakeSpeed.level3,
                    speed: 3
                })
            }
            if (this.state.score >= 2000 && this.state.score < 3000) {
                this.setState({
                    level: this.snakeSpeed.level4,
                    speed: 4
                })
            }
            if (this.state.score >= 3000) {
                this.setState({
                    level: this.snakeSpeed.level5,
                    speed: 5
                })
            }

            newSnake.unshift(head);
            if (this.sound) {
                await this.sound.replayAsync();
            }
            if (head.x === food.x && head.y === food.y) {
                // quando a cobra come a maçã 
                if (this.eatSound) {
                    await this.eatSound.replayAsync();
                }
                this.setState({
                    snake: newSnake, food: this.generateFoodPosition(),
                    score: score + 100
                });

                console.log(this.state.score);
            } else {

                newSnake.pop();
                this.setState({ snake: newSnake });
            }
            for (let i = 1; i < newSnake.length; i++) {
                if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
                    // A cobra colidiu consigo mesma, implemente a lógica de morte aqui
                    this.handleSnakeDeath();
                    this.setState({
                        level: this.snakeSpeed.level4
                    })
                    return; // Encerra o método para evitar movimentos adicionais após a morte
                }
            }
        }

    };

    // velocidade da cobra
    async componentDidMount() {
        this.moveInterval = setInterval(this.moveSnake, this.state.level);
        //som da cobra movendoce
        this.sound = new Audio.Sound();
        await this.sound.loadAsync(require('../../assets/cobra.mp3'));

        this.eatSound = new Audio.Sound();
        await this.eatSound.loadAsync(require('../../assets/comendo-maca.mp3'));

        this.deadSound = new Audio.Sound();
        await this.deadSound.loadAsync(require('../../assets/game-over-99806.mp3'));
    }

    componentDidUpdate(prevState: Readonly<SnakeGameState>) {
        // Verifica se o nível mudou e atualiza o intervalo de movimento
        if (prevState.level !== this.state.level) {
            clearInterval(this.moveInterval); // Limpa o intervalo atual

            // Define um novo intervalo com base no novo nível
            this.moveInterval = setInterval(this.moveSnake, this.state.level);


        }
    }
    handleStartGame = () => {
        // Inicie o jogo aqui
        if (!this.state.isGameRunning) {
            // Inicie o intervalo de movimento
            this.moveInterval = setInterval(this.moveSnake, this.state.level);

            // Atualize o estado para indicar que o jogo está em execução
            this.setState({ isGameRunning: true });
        }
    };

    handlePress = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
        this.setState({ direction });
    };

    render() {
        const { snake, food, isGameRunning } = this.state;

        return (
            <>
                {isGameRunning ? (
                    <>
                        <View style={styles.header}>
                            <Text style={styles.textHeader}>Total: {this.state.score}</Text>
                            <Text style={styles.textHeader}>Nível: {this.state.speed}</Text>
                        </View>

                        <View style={styles.container}>
                            {snake.map((segment, index) => (
                                <View
                                    key={index}
                                    style={{
                                        width: CELL_SIZE,
                                        height: CELL_SIZE,
                                        backgroundColor: '#35357a',
                                        position: 'absolute',
                                        left: segment.x * CELL_SIZE,
                                        top: segment.y * CELL_SIZE,
                                        borderRadius: 25,
                                        zIndex: 2,

                                    }}
                                />
                            ))}
                            <View
                                style={{
                                    width: CELL_SIZE,
                                    height: CELL_SIZE,
                                    backgroundColor: 'red',
                                    position: 'absolute',
                                    left: food.x * CELL_SIZE,
                                    top: food.y * CELL_SIZE,
                                    borderRadius: 25,
                                }}
                            />
                        </View>
                        <View  >

                            <TouchableOpacity onPress={() => this.handlePress('UP')} style={styles.button2}>
                                <AntDesign name="caretup" size={40} color="black" />
                            </TouchableOpacity>
                            <View style={styles.horizontalButtons}>
                                <TouchableOpacity onPress={() => this.handlePress('LEFT')} style={styles.button}>
                                    <AntDesign name="caretleft" size={40} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.handlePress('RIGHT')} style={styles.button}>
                                    <AntDesign name="caretright" size={40} color="black" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => this.handlePress('DOWN')} style={styles.button2}>
                                <AntDesign name="caretdown" size={40} color="black" />
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    // Botão de iniciar o jogo
                    <View style={styles.conteinerButton}>
                        <ImageBackground
                            source={require('../../assets/pedro.jpg')}
                            style={styles.backgroundImage}
                        >
                            <TouchableOpacity onPress={this.handleStartGame} style={styles.buttomStart}>
                                <Text style={styles.textStart}>Iniciar Jogo</Text>
                            </TouchableOpacity>
                        </ImageBackground>
                    </View>

                )}
            </>
        );
    }
}



export default SnakeGame;
