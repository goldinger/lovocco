import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { X_MEDIA_URL } from 'react-native-dotenv';

const WIDTH = Dimensions.get('window').width;


class GalleryImage extends React.Component {
    render() {
        const { uri } = this.props;
        return (
            <TouchableOpacity onPress={this.props.onPress}
                style={{
                    backgroundColor: 'transparent',
                    borderRadius: 0,
                    height: WIDTH / 4,
                    width: WIDTH / 4,
                    margin: 1
                }}
            >
                <Image
                    source={{uri:uri}}
                    style={{
                        height: WIDTH/4,
                        left: 0,
                        position: 'absolute',
                        resizeMode: 'cover',
                        top: 0,
                        width: WIDTH/4,
                    }}
                />
            </TouchableOpacity>
        );
    }
}


export default class PhotoGallery extends React.Component {

    onPhotoPress(photo){
        this.props.navigation.navigate('Photo', {photo, refresh: this.props.refresh});
    }

    render() {
        const {photos, onPressAdd} = this.props;
        return <View
            style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingHorizontal: WIDTH/8 - 3,
            }}
        >
            { photos.map((item) => <GalleryImage onPress={() => this.onPhotoPress(item)}
                                                 key={item.id} photoId={item.id}
                                                 uri={X_MEDIA_URL + item.image} />) }
            { (photos.length < 6) && <TouchableOpacity
                onPress={onPressAdd}
                style={{backgroundColor: 'gray', height: WIDTH / 4, width: WIDTH / 4, justifyContent: 'center', alignItems: 'center'}}>
                <Icon type="font-awesome" name="plus" size={WIDTH/5} color="white" />
            </TouchableOpacity>

            }
        </View>
    }
}

PhotoGallery.propTypes = {
    photos: PropTypes.list,
    onPressAdd: PropTypes.func
};

