package com.point.blood.config;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@Getter
public class JwtUserPrincipal implements UserDetails {
    private final UserDetails delegate;
    private final Long pointId;
    private final Long hospitalId;

    public JwtUserPrincipal(UserDetails delegate, Long pointId, Long hospitalId) {
        this.delegate = delegate;
        this.pointId = pointId;
        this.hospitalId = hospitalId;
    }

    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return delegate.getAuthorities(); }
    @Override public String getPassword() { return delegate.getPassword(); }
    @Override public String getUsername() { return delegate.getUsername(); }
    @Override public boolean isAccountNonExpired() { return delegate.isAccountNonExpired(); }
    @Override public boolean isAccountNonLocked() { return delegate.isAccountNonLocked(); }
    @Override public boolean isCredentialsNonExpired() { return delegate.isCredentialsNonExpired(); }
    @Override public boolean isEnabled() { return delegate.isEnabled(); }
}

