package com.point.blood.shared;


public interface EntityMapper <D, E>{
    public E toEntity(D dto);
    public D toDto(E entity);
}
