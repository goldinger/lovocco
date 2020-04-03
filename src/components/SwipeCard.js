import {Image, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import Toast from 'react-native-root-toast';
import LinearGradient from 'react-native-linear-gradient';

class SwipeCard extends React.Component {
    state = {
        photos: [],
        currentPhotoIndex: null,
    };

    componentDidMount() {
        if (this.props.photos && this.props.photos.length > 0){
            this.setState({photos: this.props.photos, currentPhotoIndex: 0})
        }
        else {
            let noPhotoUrl = "https://images-na.ssl-images-amazon.com/images/G/01/author-pages/no-profile-image-placeholder-na._CB484118601_.png";
            this.setState({photos: [noPhotoUrl], currentPhotoIndex: 0})
        }
    }

    onClickRight(){
        let currentIndex = this.state.currentPhotoIndex;
        if ((currentIndex + 1) < this.state.photos.length){
            this.setState({currentPhotoIndex: currentIndex + 1})
        }
        else {
            // Toast.show('edge')
        }
    };

    onClickLeft() {
        let currentIndex = this.state.currentPhotoIndex;
        if (currentIndex > 0){
            this.setState({currentPhotoIndex: currentIndex - 1});
        }
        else {
            // Toast.show('edge')
        }
    };

    onClickBottom() {
        Toast.show('description')
    }

    render() {
        let currentPhotoIndex = this.state.currentPhotoIndex;
        return <View style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}>
            <Image
                style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                source={{uri: this.state.photos[this.state.currentPhotoIndex]}} />

            <LinearGradient colors={['rgba(0,0,0,0.2)', 'transparent' ]} style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, position: "absolute", top: 0, width:'100%', height: 20}} />
            <View style={{flexDirection: "row", position: "absolute", top:0, width: '100%', paddingHorizontal: 15 , paddingVertical: 5}}>
                {this.state.photos.map((item, index) => (
                    <View style={{backgroundColor: "white", opacity: index === currentPhotoIndex ? 0.7 : 0.3, height: 5, flex: 1, marginHorizontal: 1, borderRadius: 3}} />
                ))}
            </View>
            <LinearGradient colors={['transparent', 'rgba(0,0,0,1)']} style={{borderBottomLeftRadius: 20, borderBottomRightRadius: 20, position: "absolute", bottom: 0, width:'100%', height: '40%'}} />
            <TouchableOpacity style={{position: "absolute", left:0, top:0, width:'50%', height: '80%'}} onPress={this.onClickLeft.bind(this)} />
            <TouchableOpacity style={{position: "absolute", right:0, top:0, width:'50%', height: '80%'}} onPress={this.onClickRight.bind(this)} />
            <TouchableOpacity style={{position: "absolute", bottom: 0, width:'100%', height: '20%', padding: 15}} onPress={this.onClickBottom.bind(this)}>
                <Text style={{fontSize: 25, color: "white", fontWeight: "bold"}}>{this.props.name}, {this.props.age}</Text>
                <Text style={{fontSize: 15, color: "white"}}>{this.props.description}</Text>
            </TouchableOpacity>
        </View>
    }
}

SwipeCard.propTypes = {
    photos: PropTypes.list,
    name: PropTypes.string,
    age: PropTypes.number,
    description: PropTypes.string
};


export default SwipeCard;
